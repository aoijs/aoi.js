/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [userID = d.author.id, deaf = "true"] = data.inside.splits;
    const member = await d.util.getMember(d.guild, userID)
    if (!member) return d.aoiError.fnError(d, "member", { inside: data.inside });

    const voiceState = member.voice;
    if (!voiceState.channelId) return d.aoiError.fnError(d, "custom", {}, "Provided Member Is Not In A Voice/Stage Channel");

    voiceState.setDeaf(deaf === "true")

    return {
        code: d.util.setCode(data)
    }
} 