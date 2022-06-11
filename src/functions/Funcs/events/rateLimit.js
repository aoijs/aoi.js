const {RateLimitOptions} = require("../../../utils/CallbackUtil.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const option = RateLimitOptions.find(
        (x) => x === data.inside.inside.toLowerCase(),
    );

    if (!option) return d.aoiError.fnError(d, "option", {inside: data.inside});

    data.result = d.data.rateLimit[option];

    return {
        code: d.util.setCode(data),
    };
};
