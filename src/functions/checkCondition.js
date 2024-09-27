const { CheckCondition } = require('../core/CheckCondition.js')
const { mustEscape } = require('../core/mustEscape.js')

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

    let result = CheckCondition.solve(mustEscape(condition) || "");
    result = eval(result)?.toString();

    if (!["true", "false"].includes(result)) {
        d.aoiError.fnError(d, "custom", data.inside, "Invalid Condition Provided In");
        result = undefined;
    }

    data.result = result;
    return {
        code: d.util.setCode(data)
    }
}
