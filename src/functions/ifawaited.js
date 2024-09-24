const Interpreter = require("../core/interpreter.js");
const {CheckCondition} = require("../core/CheckCondition.js");
const {mustEscape} = require("../core/mustEscape.js");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [condition, trueawait, falseawait = ""] = data.inside.splits;

    data.result = eval(CheckCondition.solve(mustEscape(condition)))
        ? trueawait.addBrackets()
        : falseawait.addBrackets();

    if (data.result.includes("{execute:")) {
        const cmd = d.client.cmd.awaited.find(
            (x) =>
                x.name.toLowerCase() ===
                data.result
                    .addBrackets()
                    .split("{execute:")[1]
                    .split("}")[0]
                    .toLowerCase(),
        );
        if (!cmd)
            return d.aoiError.fnError(
                d,
                "custom",
                {},
                `Invalid Awaited Command: '${data.result.addBrackets().split("{execute:")[1].split("}")[0]}' Provided`,
            );
        await Interpreter(
            d.client,
            d.message,
            d.args,
            cmd,
            d.client.db,
            false,
            undefined,
            d.data,
        );
        data.result = data.result
            .addBrackets()
            .replace(
                `{execute:${
                    data.result.addBrackets().split("{execute:")[1].split("}")[0]
                }}`,
                "",
            );
    } else data.result = data.result.addBrackets();

    return {
        code: d.util.setCode(data),
    };
};
