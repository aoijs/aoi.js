const { AoiInviteSystem } = require("../../../classes/AoiInviteSystem.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [option, userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, "user", { inside: data.inside });

    const fetchInvites = async () => {
        const inviteSystem = d.client.AoiInviteSystem; 
        if (inviteSystem) {
            const guild = d.guild;
            if (!guild) return 0;
            const invites = await inviteSystem.fetchInvites(guild);
            return invites.size;
        }
        return 0;
    };

    const inviteSystem = d.client.AoiInviteSystem;
    let inviter = "";
    let code = "";
    let real = 0;
    let fake = 0;

    if (inviteSystem) {
        const guild = d.guild;
        if (guild && inviteSystem.invites.has(guild.id)) {
            const invites = inviteSystem.invites.get(guild.id);
            const invite = invites.find((invite) => invite.inviter?.id === user.id);
            if (invite) {
                inviter = invite.inviter?.username;
                code = invite.code;
                real = inviteSystem.invitesCount(guild.id);
                if (real > 0) {
                    fake = await inviteSystem.count(guild.id, invite.inviter.id, "fake");
                }
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
        fetchInvites: await fetchInvites(),
    };

    if (!option) {
        return d.aoiError.fnError(d, "option", { inside: data.inside });
    }

    data.result = userInfo[option.toLowerCase()] || "";

    return {
        code: d.util.setCode(data),
    };
};
