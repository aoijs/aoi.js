const { CheckCondition } = require('../../core/CheckCondition.js')
const { mustEscape } = require('../../core/mustEscape.js')

/**
 * CheckCondition.solve()の結果（true/false/&&/||/()のみ）を安全に評価する
 * eval()を使わずにboolean式を解決する
 */
function safeEvalBoolean(expr) {
    const sanitized = expr.replace(/\s/g, "");
    // true, false, &&, ||, (, ) のみ許可
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

    const [condition] = data.inside.splits;

    if (!["==", "!=", "<=", ">=", "||", "&&", "<", ">"].some(x => condition.includes(x))) {
        return d.aoiError.fnError(d, "custom", data.inside, "Valid Operators Not Provided In");
    }

    // セキュリティ: eval()の代わりに安全なboolean評価（RCE対策）
    let result = CheckCondition.solve(mustEscape(condition) || "");
    result = safeEvalBoolean(result)?.toString();

    if (!["true", "false"].includes(result)) {
        d.aoiError.fnError(d, "custom", data.inside, "Invalid Condition Provided In");
        result = undefined;
    }

    data.result = result;
    return {
        code: d.util.setCode(data)
    }
}
