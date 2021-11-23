module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d)
    if (err) return d.error(err);

    const [userId = d.author.id, deaf = "yes"] = inside.splits;
    const member = await d.util.getMember(d.guild, userId)
    if (!member) return d.aoiError.fnError(d, "member", {inside});

    const voiceState = member.voice;
    if (!voiceState.channelId) return d.aoiError.fnError(d, "custom", {}, "Provided Member Is Not In A Voice/Stage Channel");

    voiceState.setDeaf(deaf === "yes")

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 