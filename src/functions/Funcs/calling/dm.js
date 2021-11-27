module.exports = async d => {
    const {code, inside} = d.util.openFunc(d);

    const [id = d.author.id] = inside.splits;

    let dm = await d.util.getUser(d, id);
    if (!dm) return d.aoiError.fnError(d, "user", {inside});

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        useChannel: dm
    }
} 