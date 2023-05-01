module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [Code, returnCode = "false", sendMessage = "true", returnExecution = "false", returnId = "false"] = data.inside.splits;

    let result = await d.interpreter(d.client, d.message, d.args, {
        name: "Eval",
        code: Code.addBrackets()
    }, d.client.db, returnCode === "true", undefined, {}, undefined, undefined, returnExecution === "true", returnId === "true", sendMessage === "true")

    data.result = returnCode === "true" ? ([returnId, returnExecution].join(",") === "false,false" ? result.code : require('util').inspect(result)) : undefined

    return {
        code: d.util.setCode(data)
    }
} 
