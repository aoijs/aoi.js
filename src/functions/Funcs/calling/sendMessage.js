module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [message, returnId = "no"] = inside.splits;

    message = await d.util.errorParser(message, d);

    const msg = await d.aoiError.makeMessageError(d.client, d.channel, message, message.options, d);


    const result = (returnId === "yes" ? msg?.id : "") || "";

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}