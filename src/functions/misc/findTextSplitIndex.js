module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [query, name = 'main'] = data.inside.splits;

    data.result = d.array[name].indexOf(query) + 1;

    return {
        code: d.util.setCode(data)
    }
} 
