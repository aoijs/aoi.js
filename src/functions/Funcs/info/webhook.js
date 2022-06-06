const {Webhook} = require("../../../utils/helpers/functions");

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [id, option = 'name'] = data.inside.splits;

    const webhook = await d.client.fetchWebhook(id).catch(err => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Webhook Id Provided In');
    });

    data.result = Webhook(webhook)[option];

    return {
        code: d.util.setCode(data)
    }
}