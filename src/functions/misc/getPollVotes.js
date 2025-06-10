/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId = d.channel?.id, messageId = d.message?.id, pollId, format = "username", separator = ", "] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    const pollData = await channel.messages.fetchPollAnswerVoters({ messageId: message.id, answerId: Number(pollId) }).catch((err) => {
        d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed to fetch poll data with reason: " + err);
    });

    switch (format) {
        case "username":
            data.result = pollData.map((x) => x.username);
            break;
        case "tag":
            data.result = pollData.map((x) => x.tag);
            break;
        case "id":
            data.result = pollData.map((x) => x.id);
            break;
        default:
            if (format.includes("{")) {
                data.result = pollData.map((x) => {
                    let pollVotes = format;
                    for (let y in x) {
                        pollVotes = pollVotes.replaceAll(`{${y}}`, x[y]);
                    }
                    return pollVotes;
                });
            } else {
                return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Format Provided In");
            }
    }

    data.result = data.result.join(separator);

    return {
        code: d.util.setCode(data)
    };
};