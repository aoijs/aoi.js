module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, ...options] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    let object;
    const channel = guild.channels.cache
        .filter((x) => x.type === d.util.channelTypes.Text)
        .random();

    try {
        object = JSON.parse(options[0]);
    } catch {
        object = {
            temporary: options[0],
            maxAge: options[1],
            maxUses: options[2],
            unique: options[3],
            targetUser: options[4]?.trim() || undefined,
            targetApplication: options[5]?.trim() || undefined,
            targetType: options[6]?.trim() || undefined,
        };
    }

    const invite = await guild.invites
        .create(channel?.id, object)
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Create Invite With Reason: " + e,
            );
        });

    data.result = invite.url;

    return {
        code: d.util.setCode(data),
    };
};
