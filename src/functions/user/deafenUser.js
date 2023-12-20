module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d)
    if (err) return d.error(err);

    const [userID = d.author.id, deaf = "true"] = inside.splits;
    const member = await d.util.getMember(d.guild, userID)
    if (!member) return d.aoiError.fnError(d, "member", {inside});

    const voiceState = member.voice;
    if (!voiceState.channelID) return d.aoiError.fnError(d, "custom", {}, "Provided Member Is Not In A Voice/Stage Channel");

    voiceState.setDeaf(deaf === "true")

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 