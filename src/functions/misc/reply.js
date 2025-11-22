/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    const [channelID, messageID, disablePing = 'false'] = data.inside.splits;

    d.allowedMentions.repliedUser = disablePing === "false";

    return {
        code: d.util.setCode(data),
        reply: {
            message: messageID,
            channel: channelID,
            user: disablePing === 'false'
        },
        allowedMentions: d.allowedMentions
    };
};
