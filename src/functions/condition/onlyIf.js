const {CheckCondition} = require("../../core/CheckCondition.js");
const {mustEscape} = require("../../core/mustEscape.js");

/**
 * CheckCondition.solve()の結果（true/false/&&/||/()のみ）を安全に評価する
 * eval()を使わずにboolean式を解決する
 */
function safeEvalBoolean(expr) {
    const sanitized = expr.replace(/\s/g, "");
    // Only allow: true, false, &&, ||, (, )
    if (!/^[truefals&|()]+$/.test(sanitized)) return undefined;

    try {
        return new Function('"use strict"; return (' + sanitized + ")")();
    } catch {
        return undefined;
    }
}

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [condition, err = ''] = data.inside.splits;

    // Security: safe boolean evaluation instead of eval() to prevent RCE
    if (!safeEvalBoolean(CheckCondition.solve(mustEscape(condition)))) {
        error = true;
        if (err?.trim() === "") {
        } else {
            const errorMsg = await d.util.errorParser(err, d);
            d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorMsg.data ?? errorMsg,
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
