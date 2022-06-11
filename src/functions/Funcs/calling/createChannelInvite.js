module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [channelId = d.channel?.id, ...options] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel)
        return d.aoiError.fnError(d, "channel", {inside: data.inside});

    let object;

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

    const invite = await channel.guild.invites
        .create(channel.id, object)
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
