const {CheckCondition} = require("../../../utils/helpers/checkCondition.js");
const {mustEscape} = require("../../../utils/helpers/mustEscape.js");

module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [condition, err = ''] = data.inside.splits;

    if (!eval(CheckCondition.solve(mustEscape(condition)))) {
        error = true;
        if (err?.trim() === "") {
        } else {
            const errorMsg = await d.util.errorParser(err, d);
            d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorMsg,
                errorMsg.options,
                d,
            );
        }
    }

    return {
        code: d.util.setCode(data),
        error,
    };
};
