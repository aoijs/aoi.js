/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    let [ channelID = d.channel.id, messageID = d.message.id ] = data.inside.splits;

    // Obtener el canal
    const channel = await d.util.getChannel(d, channelID);
    if (!channel) {
        data.result = "Canal no encontrado";
        return { code: d.util.setCode(data) };
    }

    const message = await d.util.fetchMessage(channel, messageID);
    if (!message) {
        data.result = "Message not found";
        return { code: d.util.setCode(data) };
    }

    const referencedMessageID = message.reference?.messageId;
    if (!referencedMessageID) {
        data.result = "No hay referencia";
        return { code: d.util.setCode(data) };
    }

    const referencedMessage = await d.util.fetchMessage(channel, referencedMessageID);
    if (!referencedMessage) {
        data.result = "Referenced message not found";
        return { code: d.util.setCode(data) };
    }

    data.result = referencedMessage.author.id;

    return { code: d.util.setCode(data) };
};
