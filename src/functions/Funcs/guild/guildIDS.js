module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [sep = ' , '] = data.inside.splits

    data.result = [...d.client.guilds.cache.keys()].join(sep);

    return {
        code: d.util.setCode(data)
    }
}