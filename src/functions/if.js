const Interpreter = require("../core/interpreter.js");
const { CheckCondition } = require("../core/CheckCondition.js");
const { mustEscape } = require("../core/mustEscape.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [condition, truecon, falsecon] = data.inside.splits;

    const res = eval(CheckCondition.solve(mustEscape(condition)))

    data.result = res ? truecon?.addBrackets() : falsecon?.addBrackets();
    
    return {
        code: d.util.setCode(data),
    };
};
