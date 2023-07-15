const { EventEmitter } = require("events");
const { KeyValue } = require("@akarui/aoi.db");
const { Group } = require("@akarui/structures");
const { setTimeout: timer } = require("timers/promises");

class AoiInviteSystem extends EventEmitter {
    fakeLimit = "1209600000";
    cache = {
        invites: new Group(),
        users: new Group(),
        guilds: undefined,
    };
    options;
    db;
    client;
    readyAt;

    constructor(client, cache = false) {
        super();
        this.options = {
            cache: cache,
        };
        this.client = client;

        this.db = new KeyValue({
            path: "./database/",
            tables: ["invite","inviteCodes"], // Specify the table name here
        });
        this.db.connect();

        this.client.AoiInviteSystem = this;
        this.on("FetchFinished", () => {
            this.readyAt = Date.now();
            console.log(
                `${new Date().toLocaleString()} [AoiInviteSystem]: Fetched All Invites`,
            );
        });

        this.#bindEvents();
    }

    async fetchAll() {
        const guilds = this.cache.guilds.allValues();

        for (let i = 0; i < guilds.length; i++) {
            const guild = guilds[i];
            const invites = await guild.invites.fetch().catch((e) => {
                return null;
            });
            const entries = structuredClone([...invites.entries()]);
            this.cache.invites.set(guild.id, new Group(entries));
            await timer(1500);
        }

        this.emit("FetchFinished");
    }

    async fetchInvites(guild) {
        return guild.invites.fetch().catch((e) => {
            return null;
        });
    }

    async fetchInviters() {
        const allData = await this.db.all("invite");
        for (const data of allData) {
            const [userID, guildID] = data.key.split("_");
            if (!this.cache.users.has(userID)) {
                this.cache.users.set(userID, new Group());
            }

            this.cache.users.get(userID).set(guildID, data.value);
        }
        console.log(
            `${new Date().toLocaleString()} [AoiInviteSystem]: Fetched All Inviters`,
        );
    }

    get totalInvitesCount() {
        return this.cache.invites.reduce((acc, cur) => acc + cur.size, 0);
    }

    invitesCount(guildID) {
        return this.cache.invites.get(guildID).size;
    }

    async set(guildID, userID, inviteData) {
        
        if (this.cache.users.has(userID)) {
            this.cache.users.get(userID).set(guildID, inviteData);
        } else {
            this.cache.users.set(userID, new Group());
            this.cache.users.get(userID).set(guildID, inviteData);
        }
        await this.db.set("invite", userID + "_" + guildID, {
            value: inviteData,
        });
    }

    async setCode(guildID, code, codeData) {
        if(codeData.length == 0) {
            await this.db.delete("inviteCodes", code + "_" + guildID);
            return;
        }
        await this.db.set("inviteCodes", code + "_" + guildID, {
            value: codeData,
        });
    }

    async deleteCode(guildID, code) {
        await this.db.delete("inviteCodes", code + "_" + guildID);
    }

    async getCode(guildID, code) {
            return (await this.db.get("inviteCodes", code + "_" + guildID))
                ?.value;
    }

    async get(guildID, userID) {
        if (!this.cache.users.has(userID)) {
            return (await this.db.get("invite", userID + "_" + guildID))?.value;
        } else {
            return await this.cache.users.get(userID).get(guildID);
        }
    }
    async delete(guildID, userID, code) {
        if (this.cache.users.has(userID))
            this.cache.users.get(userID).delete(guildID);

        return await this.db.delete("invite", userID + "_" + guildID);
    }

    async lb(
        guildId,
        custom = "{top}) {username}: `total:{total}`,`real:{real}`,`fake:{fake}`,`leave:{leave}`",
        list = 10,
        page = 1,
    ) {
        let datas;
        if (this.cache.users.size) {
            datas = this.cache.users.allValues().map((x) => x.get(guildId)).map(x => {
                return {
                    value: x,
                }
            });
        } else {
            datas = await this.db.all("invite", (x) => x.key.endsWith(guildId));
        }
        let lb = [];
        let i = 1;
        datas = datas.sort((a, b) =>{
            if(a.value.counts.total > b.value.counts.total) return -1;
            if(a.value.counts.total < b.value.counts.total) return 1;
            if(a.value.counts.total == b.value.counts.total) {
                if(a.value.counts.real > b.value.counts.real) return -1;
                if(a.value.counts.real < b.value.counts.real) return 1;
                if(a.value.counts.real == b.value.counts.real) return 0;
            }
        });
        for (const d of datas) {
            const format = custom
                .replace(/{top}/g, i)
                .replace(
                    /{username}/g,
                    this.client.users.cache.get(d.value.inviter)
                        ?.username,
                )
                .replace(/{total}/g, d.value.counts.total)
                .replace(/{real}/g, d.value.counts.real)
                .replace(/{fake}/g, d.value.counts.fake)
                .replace(/{leave}/g, d.value.counts.leave)
                .replace(/{id}/g, d.value.inviter)
                .replace(
                    /{tag}/g,
                    this.client.users.cache.get(d.value.inviter)?.tag,
                );

            lb.push(format);
            i++;
        }
        return lb.slice((page - 1) * list, page * list).join("\n");
    }

    async memberJoin(member) {

        const invites = await this.fetchInvites(member.guild);
        const oldInvites = this.cache.invites.get(member.guild.id);
        const invite = invites.find(
            (x) =>
                x.uses > oldInvites.get(x.code).uses 
        );
        if (!invite) return;

        const inviter = invite.inviter;
        let inviterData = await this.get(member.guild.id, inviter.id);

        if (!inviterData) {
            inviterData = AoiInviteSystem.defaultInviteData(invite.inviter);
        }

        const data = {
            inviter: inviter.id,
            codes: inviterData.codes,
            counts: {
                total: inviterData ? inviterData.counts.total + 1 : inviterData,
                real: inviterData ?  this.isFake(member) ? inviterData.counts.real : inviterData.counts.real + 1 : inviterData,
                fake: inviterData ? this.isFake(member) ? inviterData.counts.fake + 1 : inviterData.counts.fake : inviterData,
                leave: inviterData ? inviterData.counts.leave : inviterData,
            },
        };
        const codeData = await this.getCode(member.guild.id, invite.code);
        await this.setCode(member.guild.id, invite.code, [...(codeData ?? []), member.id]);

        await this.set(member.guild.id, inviter.id, data);
    }

    isFake(member) {
        return Date.now() - member.user.createdTimestamp < this.fakeLimit ||
            member.user.bot
        
    }

    async memberLeave(member) {
        const ddd = await this.db.all("inviteCodes");
        const d = ddd.find(x => x.value.includes(member.id));
        if(!d) return;
        const code = d.key.split("_")[0];
        const invite = await this.client.fetchInvite(code);
        const inviter = invite.inviter.id;
        let inviterData = await this.get(member.guild.id, inviter.id);

        if (!inviterData) {
            inviterData = AoiInviteSystem.defaultInviteData(invite.inviter);
            inviterData.codes = [invite.code];
        }

        const data = {
            inviter: inviter,
            codes: inviterData.codes,
            counts: {
                total: inviterData ? inviterData.counts.total +1 : 0,
                real: inviterData ? 
                inviterData.counts.real 
                : 0, // this.isFake(member) ? inviterData.counts.real : inviterData.counts.real - 1 : 0,
                fake: inviterData ? inviterData.counts.fake : 0,
                leave: inviterData ? inviterData.counts.leave + 1 : 0,
            },
        };

        const codeData = await this.getCode(member.guild.id, invite.code);
        await this.setCode(invite.guild.id, invite.code, codeData.filter(x => x !== member.id));

        await this.set(invite.guild.id, inviter, data);
    }

    async inviteCreate(invite) {
        let inviterData = await this.get(invite.guild.id, invite.inviter.id);
        if (!inviterData)
            inviterData = AoiInviteSystem.defaultInviteData(invite.inviter);
        const data = {
            inviter: invite.inviter.id,
            codes: [...inviterData.codes, invite.code],
            counts: {
                total: inviterData ? inviterData.counts.total : 0,
                real: inviterData ? inviterData.counts.real : 0,
                fake: inviterData ? inviterData.counts.fake : 0,
                leave: inviterData ? inviterData.counts.leave : 0,
            },
        };
        this.cache.invites.get(invite.guild.id).set(invite.code, invite);
        await this.set(invite.guild.id, data.inviter, data);
        
        await this.setCode(invite.guild.id, invite.code, []);

    }

    async inviteDelete(invite) {
        const inviterData = await this.get(invite.guild.id, invite.inviterId);
        if (!inviterData) return;
        const data = {
            inviter: invite.inviter.id,
            codes: inviterData.codes.filter((x) => x !== invite.code),
            counts: {
                total: inviterData ? inviterData.counts.total : inviterData,
                real: inviterData ? inviterData.counts.real : inviterData,
                fake: inviterData ? inviterData.counts.fake : inviterData,
                leave: inviterData ? inviterData.counts.leave : inviterData,
            },
        };
        this.cache.invites.get(invite.guild.id).delete(invite.code);
        await this.set(invite.guild.id, invite.inviter.id, data);

        await this.deleteCode(invite.guild.id, invite.code);
    }

    #bindEvents() {
        this.client.prependOnceListener("ready", () => {
            this.cache.guilds = new Group(this.client.guilds.cache.entries());
            this.fetchAll();

            if (this.options.cache) {
                this.fetchInviters();
            }
        });

        this.client.prependListener("inviteCreate", (invite) => this.inviteCreate(invite));
        this.client.prependListener("inviteDelete", (invite) => this.inviteDelete(invite));
        this.client.prependListener("guildMemberAdd", (member) => this.memberJoin(member));
        this.client.prependListener("guildMemberRemove", (member) =>
            this.memberLeave(member),
        );

        this.client.prependListener("guildBanAdd", (ban) =>
            this.memberLeave({
                user: ban.user,
                guild: ban.guild,
            }),
        );
    }

    invitesCount(guildID) {
        return this.cache.invites.get(guildID).size;
    }

    async count(guildID, inviter, type) {
        if (this.cache) {
            const user = this.cache.users.get(inviter)?.get(guildID);
            if (!user) return "User isn't an inviter for this server";
            return user.counts[type];
        } else {
            const data = await this.db.get(`${inviter}_${guildID}`);
            return data?.value.counts[type] || "";
        }
    }

    static defaultInviteData(inviter) {
        return {
            inviter: inviter.id,
            codes: [],
            counts: {
                total: 0,
                real: 0,
                fake: 0,
                leave: 0,
            },
        };
    }
}

module.exports = AoiInviteSystem;
