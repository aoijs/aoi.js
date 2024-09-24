/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, token] = data.inside.splits;
    const webhook = await d.client.fetchWebhook(id, token).catch(e => {
        d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid WebhookId Provided In");
    });

    webhook.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Webhook With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
} 