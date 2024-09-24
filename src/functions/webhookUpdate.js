const {WebhookUpdateOptions} = require("../utils/EventUtil.js")

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const option = WebhookUpdateOptions.includes(data.inside.inside);

    if (!option) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, `Invalid option in`);

    data.result = d.data.channel[WebhookUpdateOptions[option]];

    return {
        code: d.util.setCode(data)
    };
};