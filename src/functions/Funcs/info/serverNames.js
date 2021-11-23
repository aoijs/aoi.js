module.exports = d => {
    let {code, result, inside} = d.util.openFunc(d);

    const sep = inside.inside || ' , ';

    result = d.client.guilds.cache.map(x => x.name).join(sep);

    return {
        code: d.util.setCode({function: d.func, code, result, inside})
    }
}