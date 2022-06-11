module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, message, returnId = 'no'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const sendData = {
        content: message.addBrackets(),
        tts: true
    }

    const msg = await channel.send(sendData).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Send TTS With Reason: ' + err);
    });

    data.result = returnId === 'yes' ? msg.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}