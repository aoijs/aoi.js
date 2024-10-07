/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID, messageID, ...reactions] = data.inside.splits;
    const channel = await d.util.getChannel(d, channelID);

    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
    const message = await d.util.getMessage(channel, messageID);

    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });
    reactions = reactions.reverse();

    for (let i = reactions.length - 1; i >= 0; i--) {        
        let reaction = await d.util.getEmoji(d, reactions[i]);
        if (!reaction) reaction = reactions[i].addBrackets().trim();
        await message.react(reaction).catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
    }

    return {
        code: d.util.setCode(data)
    };
};
