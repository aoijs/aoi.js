module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const guildID = d.guild.id;
    const invite = d.data.inviteData;
    if (!invite) {
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            "Invite data not found."
        );
    }

    const inviteInfo = {
        inviteURL: invite.url || "",
        inviteCode: invite.code || "",
        inviteGuildID: invite.guild?.id || "",
        inviteChannelID: invite.channel?.id || "",
        inviteUserID: invite.inviter?.id || "",
        inviteMaxUses: invite.maxUses || "",
    };

    data.result = inviteInfo;

    return {
        code: d.util.setCode(data),
    };
};