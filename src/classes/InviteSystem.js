const {EventEmitter} = require("events");
const { Group } = require( "./structures/dist" );
const timer = (ms) => new Promise((res) => setTimeout(() => res, ms));

class InviteSystem extends EventEmitter {
    constructor(client, cache = false) {
        super();
        this.fakeLimit = "1209600000";
        this.cache = cache;
        this.client = client;
        this.invites = new Group();
        this.ready = false;
        this.timeStamp = null;
        this.guilds = client.guilds.cache;
        this.db = this.client.db;
        if (cache) {
            this.users = new Group();
        }

        this.on("FINISHED", () => {
            console.log("Fetched All Invites");
            this.timeStamp = Date.now();
            this.ready = true;
        });
        this.client.inviteSystem = this;
    }

    async fetchAll() {
        this.ready = false;
        for (let i = 0; i < this.guilds.size; i++) {
            const guild = [...this.guilds.values()][i];
            this.invites.set(guild.id, await guild.invites.fetch());

            await timer(1500);
        }
        this.emit("FINISHED");
    }

    async fetchInvites(guild) {
        return guild.invites.fetch();
    }

    async fetchInviters() {
        const allData = await this.db.all("invite");
        for (const data of allData) {
            this.users.set(data.key, data);
        }
        console.log("Fetched All Inviters");
    }

    get totalInvitesCount() {
        let i = 0;
        for (const invites of this.invites.array()) {
            i += invites.size;
        }
        return i;
    }

    set(guildID, code, invite) {
        return this.invites.get(guildID).set(code, invite);
    }

    invitesCount(guildID) {
        return this.invites.get(guildID).size;
    }

    delete(guildID, code) {
        this.invites.get(guildID).delete(code);
    }

    dataFormat() {
        const format = {
            inviter: {id: "id", code: []},
            counts: {real: 0, fake: 0, leave: 0, bonus: 0, total: 0},
        };
        return format;
    }

    createUser(guild, userID, code) {
        let data = this.dataFormat();
        data.inviter.id = userID;
        data.inviter.code.push(code);
        this.db.set(this.db.tables[0], `${guild}_${userID}`, data);
        return;
    }

    async count(guildID, inviter, type) {
        if (this.cache) {
            const user = this.users.get(`${guildID}_${inviter}`);
            if (!user) return "User isn't An Inviter For this Server";
            return user.value.counts[type];
        } else {
            const data = await this.db.get(
                this.db.tables[0],
                `${guildID}_${inviter}`,
            );
            return data.value.counts[type] || "";
        }
    }

    async lb(
        custom = "{top}) {username}: `total:{total}`,`real:{real}`,`fake:{fake}`,`leave:{leave}`",
        list = 10,
        page = 1,
    ) {
        let datas;
        if (this.cache) {
            datas = this.users.allValues();
        } else {
            datas = await this.db.all(this.db.tables[0]);
        }
        let lb = [];
        let i = 1;

        for (const d of datas) {
            const format = custom
                .replace(/{top}/g, i)
                .replace(
                    /{username}/g,
                    this.client.users.cache.get(d.data.value.inviter.id)?.username,
                )
                .replace(/{total}/g, d.data.value.counts.total)
                .replace(/{real}/g, d.data.value.counts.real)
                .replace(/{fake}/g, d.data.value.counts.fake)
                .replace(/{leave}/g, d.data.value.counts.leave)
                .replace(/{id}/g, d.data.value.inviter.id)
                .replace(
                    /{tag}/g,
                    this.client.users.cache.get(d.data.value.inviter.id)?.tag,
                );

            lb.push(format);
            i++;
        }
        return lb.slice((page - 1) * list, page * list).join("\n");
    }

    async userJoined(mem) {
        const invites = this.invites.get(mem.guild.id).allValues();
        const newDatas = (await this.fetchInvites(mem.guild)).allValues();
        for (let i = 0; i < invites.length; i++) {
            const index = invites.indexOf(newDatas[i].code);

            if (invites[index] && invites[index].uses < newDatas[i].uses) {
                const inviter = await this.db.get(
                    "invite",
                    `${mem.guild.id}_${invites[index].inviter.id}`,
                );
                if (
                    Number(BigInt(mem.user.createdTimestamp)) >=
                    Number(BigInt(this.fake.limit))
                ) {
                    inviter.value.counts.real += 1;
                    inviter.value.counts.total += 1;
                } else {
                    inviter.value.counts.fake += 1;
                }
                this.db.set("invite", `${mem.guild.id}_${inviter.id}`, inviter.value);
                break;
            } else {
                continue;
            }
        }
    }

    async inviteCreate(invite) {
        const user = await this.db.get(invite.inviter?.id);
        if (user) {
            user.inviter.code.push(invite.code);
            this.db.set("invite", invite.inviter?.id, user);
        } else return;
    }

    async inviteDelete(invite) {
        const user = await this.db.get(invite.inviter?.id);
        if (user) {
            const index = user.inviter.code.indexOf(invite.code);
            user.inviter.code.splice(index, 1);
            this.db.set("invite", invite.inviter?.id, user);
        }
    }
}

module.exports = InviteSystem;