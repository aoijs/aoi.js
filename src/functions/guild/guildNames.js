/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [sep = ' , '] = data.inside.splits

    data.result = d.client.guilds.cache.map(x => x.name).join(sep);

    return {
        code: d.util.setCode(data)
    }
}