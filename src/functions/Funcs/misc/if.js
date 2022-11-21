const Interpreter = require("../../../interpreter.js");
const { CheckCondition } = require("../../../utils/helpers/checkCondition.js");
const { mustEscape } = require("../../../utils/helpers/mustEscape.js");
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [condition, truecon,falsecon] = data.inside.splits;

    data.result = eval(CheckCondition.solve(mustEscape(condition)))


    
    return {
        code: d.util.setCode(data),
    };
};
