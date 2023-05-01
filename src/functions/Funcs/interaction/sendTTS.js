module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID, message, returnId = 'false'] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    const sendData = {
        content: message.addBrackets(),
        tts: true
    }

    const msg = await channel.send(sendData).catch(err => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Send TTS With Reason: ' + err);
    });

    data.result = returnId === 'true' ? msg.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}