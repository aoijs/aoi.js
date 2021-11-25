const {CheckCondition} = require('../../../utils/helpers/checkCondition.js')
const {mustEscape} = require('../../../utils/helpers/mustEscape.js')
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) d.error(err);

    const [condition] = inside.splits;

    if (!["==", "!=", "<=", ">=", "||", "&&", "<", ">"].some(x => condition.includes(x))) return d.aoiError.fnError(d, "custom", {inside}, "Valid Operators Not Provided In");

    let result = CheckCondition.solve(mustEscape(condition) || "")

    result = eval(result)?.toString()

    if (!["true", "false"].includes(result)) {
        d.aoiError.fnError(d, "custom", {inside}, "Invalid Condition Provided In");
        result = undefined;
    }

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
} 