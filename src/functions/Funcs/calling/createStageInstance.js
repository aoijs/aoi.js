module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [channelID, topic, privacy = "public"] = inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});
    if (channel.type !== d.util.channelTypes.Stage) return d.aoiError.fnError(d, "custom", {}, "Provided Channel Is Not A Stage Channel");

    channel.createStageInstance({topic: topic.addBrackets(), privacyLevel: privacy.toUpperCase()}).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Stage Instance With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 