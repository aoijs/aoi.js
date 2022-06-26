module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel)
        return d.aoiError.fnError(d, "channel", {inside: data.inside});
    if (channel.type !== d.util.channelTypes.Stage)
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Provided Channel Is Not A Stage Channel",
        );

    if (!channel.stageInstance) {
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            "Provided Channel Has No Stage Instance",
        );
    }

    await channel.stageInstance.delete().catch((e) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            "Failed To Delete Stage Instance With Reason: " + e,
        );
    });

    return {
        code: d.util.setCode(data),
    };
};