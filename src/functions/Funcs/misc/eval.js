module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [Code, returnCode = "no", sendMessage = "yes", returnExecution = "no", returnId = "no"] = data.inside.splits;

    let result = await d.interpreter(d.client, d.message, d.args, {
        name: "Eval",
        code: Code.addBrackets()
    }, d.client.db, returnCode === "yes", undefined, {}, undefined, undefined, returnExecution === "yes", returnId === "yes", sendMessage === "yes")

    data.result = returnCode === "yes" ? ([returnId, returnExecution].join(",") === "no,no" ? result.code : require('util').inspect(result)) : undefined

    return {
        code: d.util.setCode(data)
    }
} 
