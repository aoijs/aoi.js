/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [ channelID = d.channel?.id ] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);

    data.result = channel?.lastPinTimestamp;

    return {
        code: d.util.setCode(data),
    }
}