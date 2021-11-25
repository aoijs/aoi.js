module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [channelId = d.channel?.id, messageId = d.message?.id, option = 'content'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const message = await d.util.getMessage(channel, messageId);
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