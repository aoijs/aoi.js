/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, topic, privacy = "public"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
    if (channel.type !== d.util.channelTypes.Stage) return d.aoiError.fnError(d, "custom", {}, "Provided Channel Is Not A Stage Channel");

    channel.createStageInstance({topic: topic.addBrackets(), privacyLevel: privacy.toUpperCase()}).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Stage Instance With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
} 