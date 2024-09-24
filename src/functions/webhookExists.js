/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, token = null] = data.inside.splits;

    const webhook = await d.client.fetchWebhook(id, token).catch(err => {
    });

    data.result = !!webhook;

    return {
        code: d.util.setCode(data)
    }
}
