module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [...stuffs] = data.inside.splits;
    const err = stuffs.pop();
    const errorMsg = await d.util.errorParser(err, d);

    if (!stuffs.includes(d.author?.id)) {
        error = true;
        if (err?.trim() === '') {
        } else {
            const errorMsg = await d.util.errorParser(err, d);
            d.aoiError.makeMessageError(
                d.client,
                d.channel,
                errorMsg,
                errorMsg.options,
                d,
            );
        }
    }

    return {
        code: d.util.setCode(data),
        error
    }
}