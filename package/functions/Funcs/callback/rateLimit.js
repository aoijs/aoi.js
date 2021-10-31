const { RateLimitOptions } = require('../../../Utils/CallbackUtil.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const option = RateLimitOptions.find(x => x === data.inside.inside.toLowerCase());

    if (!option) return d.aoiError.fnError(d, 'option', { inside: data.inside });

    data.result = d.data.rateLimit[rateLimitOptions[option]];

    return {
        code: d.util.setCode(data)
    }
}