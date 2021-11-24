module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    const [id, token] = inside.splits;
    const webhook = await d.client.fetchWebhook(id, token).catch(e => {
        d.aoiError.fnError(d, "custom", {inside}, "Invalid WebhookId Provided In");
    });

    webhook.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Webhook With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 