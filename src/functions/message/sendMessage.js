module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [message, returnID = "false"] = data.inside.splits;

    message = await d.util.errorParser(message, d);
    const msg = await d.aoiError.makeMessageError(d.client, d.channel, message.data ?? message, message.options, d);

    data.result = (returnID === "true" ? msg?.id : "") || "";

    return {
        code: d.util.setCode(data)
    }
}