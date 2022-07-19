const {Time} = require("../../../utils/helpers/customParser.js");
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    let [
        guildID = d.guild?.id,
        memberId = d.author?.id,
        timeout = "60s",
        timeoutEndsAt = "no",
        reason,
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getMember(guild, memberId);
    if (!member) return d.aoiError.fnError(d, "member", {inside: data.inside});

    timeout = isNaN(timeout) ? Time.parse(timeout).ms : Number(timeout) * 1000;

    const mem = await member
        .timeout(timeout === 0 ? null : timeout, reason)
        .catch((err) => {
            return d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Timeout The Member With Reason:${err}`,
            );
        });

    data.result =
        timeoutEndsAt === "yes"
            ? mem.communicationDisabledUntilTimestamp
            : undefined;

    return {
        code: d.util.setCode(data),
    };
};
