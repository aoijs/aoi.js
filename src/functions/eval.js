/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [code, returnCode = "false", sendMessage = "false", returnExecution = "false", returnID = "false"] = data.inside.splits;

    const options = {
        name: "eval",
        code: code.addBrackets(),
    };

    let result = await d.interpreter(d.client, d.message, d.args, options, d.client.db, returnCode === "true", undefined, {}, undefined, undefined, returnExecution === "true", returnID === "true", sendMessage === "true");

    data.result = returnCode === "true" ? ([returnID, returnExecution].join(",") === "false,false" ? result.code : require('util').inspect(result)) : undefined;

    return {
        code: d.util.setCode(data),
    };
};
