module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelID = d.channel?.id, messageID = d.message?.id, option = 'content'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageID);
    if (!message) return d.aoiError.fnError(d, 'message', {inside: data.inside});

    const msg = {
        content: message.content,
        userid: message.author?.id,
        usertag: message.author?.tag,
        username: message.author?.username
    }

    data.result = msg[option.addBrackets().toLowerCase()]

    return {
        code: d.util.setCode(data)
    }
}