module.exports = async (d) => {
    const data = d.util.openFunc(d);

    let [
        guildId = d.guild?.id,
        memberId = d.author?.id,
        timeout = "60",
        timeoutEndsAt = "no",
        reason,
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getMember(guild, memberId);
    if (!member) return d.aoiError.fnError(d, "member", {inside: data.inside});

    timeout = Number(timeout);

    if (![0, 60, 300, 600, 3600, 86400, 7 * 86400].includes(timeout))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid Timeout Time Provided In",
        );

    const mem = await member
        .edit(
            {
                communication_disabled_until:
                    timeout === 0
                        ? null
                        : new Date(Date.now() + timeout * 1000).toISOString(),
            },
            reason,
        )
        .catch((err) => {
            return d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Timeout The Member With Reason:${err}`,
            );
        });

    data.result =
        timeoutEndsAt === "yes" ? Date.now() + timeout * 1000 : undefined;

    return {
        code: d.util.setCode(data),
    };
};
