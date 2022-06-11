module.exports = d => {
    let {code, result, inside} = d.util.aoiFunc(d);

    const sep = inside.inside || ' , ';

    result = [...d.client.guilds.cache.keys()].join(sep);

    return {
        code: d.util.setCode({function: d.func, code, result, inside})
    }
}