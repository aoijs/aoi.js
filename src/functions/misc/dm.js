/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [id = d.author.id] = data.inside.splits;

    let dm = await d.util.getUser(d, id);
    if (!dm) return d.aoiError.fnError(d, "user", { inside: data.inside });

    return {
        code: d.util.setCode(data),
        useChannel: dm
    }
} 