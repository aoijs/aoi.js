module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [err] = data.inside.splits;
    const errorMsg = await d.util.errorParser(err, d);

    if (!d.channel.nsfw) {
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