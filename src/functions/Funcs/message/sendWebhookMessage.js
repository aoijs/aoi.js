const {WebhookClient} = require('discord.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, token, message, returnId = 'false'] = data.inside.splits;

    const webhook = new WebhookClient({id, token: token.addBrackets()});
    const sendMessage = await d.util.errorParser(message, d);

    let msg;
    try {
        msg = await d.aoiError.makeMessageError(d.client, webhook, sendMessage.data ?? sendMessage, sendMessage.options, d);
    } catch (err) {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Send Webhook Message With Reason: ' + err);
    }

    data.result = returnId === 'true' ? msg?.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}