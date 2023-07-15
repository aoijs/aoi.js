const { AoiInviteSystem } = require("../../classes/AoiInviteSystem.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [option, userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, "user", { inside: data.inside });

    const inviteSystem = d.client.AoiInviteSystem;
    let inviter = "";
    let code = "";
    let real = 0;
    let fake = 0;
    let total = 0;
    let leave = 0;

    if (inviteSystem) {
        const guild = d.guild;
        if (guild && inviteSystem.cache.invites.has(guild.id)) {
            const invites = inviteSystem.cache.invites.get(guild.id);
            const allinvites = invites.filter((invite) => invite.inviterId === user.id);
            if (allinvites.size) {
                inviter = allinvites.top().inviterId;
                code = allinvites.map((invite) => invite.code).join(", ");
                real = await inviteSystem.count(guild.id,inviter , "real");
                fake = await inviteSystem.count(guild.id, inviter ,"fake");
                total = await inviteSystem.count(guild.id, inviter ,"total");
                leave = await inviteSystem.count(guild.id, inviter ,"leave");
            }
        }
    }

    const userInfo = {
        username: user.username,
        discriminator: user.discriminator,
        id: user.id,
        avatar: user.avatarURL({ dynamic: true }),
        inviter,
        code,
        real,
        fake,
        total,
        leave,
    };

    if (!option) {
        return d.aoiError.fnError(d, "option", { inside: data.inside });
    }

    data.result = userInfo[option.toLowerCase()] ?? "";

    return {
        code: d.util.setCode(data),
    };
};
