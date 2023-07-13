module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const inviteSystem = d.client.AoiInviteSystem;
    if (!inviteSystem || !inviteSystem.ready) {
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            "Invite system is not initialized or not ready."
        );
    }

    const guildID = data.guild.id;
    const inviteCode = data.inviteCode;
    const invite = inviteSystem.invites.get(guildID)?.get(inviteCode);
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
