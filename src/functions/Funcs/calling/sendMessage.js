module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [message, returnId = "false"] = inside.splits;

    message = await d.util.errorParser( message, d );
    const msg = await d.aoiError.makeMessageError(d.client, d.channel, message.data ?? message, message.options, d);


    const result = (returnId === "true" ? msg?.id : "") || "";

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}