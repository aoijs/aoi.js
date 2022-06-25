const {WebhookClient} = require("discord.js");

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, token, messageID, message, returnID = "yes"] = data.inside.splits;

    const webhook = new WebhookClient({id, token: token.addBrackets()});
    const editMessage = await d.util.errorParser(message, d);

    const editedMessageData = await webhook.editMessage(messageID, editMessage).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Edit Webhook Message With Reason: " + e);
    });

    if (returnID === "yes") data.result = editedMessageData?.id;

    return {
        code: d.util.setCode(data)
    }

}