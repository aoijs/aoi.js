module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    let [emoji] = inside.splits;
    emoji = await d.util.getEmoji(d, emoji);
    if (!emoji) return d.aoiError.fnError(d, "emoji", {inside});

    emoji.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Emoji: " + emoji.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}