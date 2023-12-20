module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [query] = data.inside.splits;

    data.result = d.array.indexOf(query) + 1;

    return {
        code: d.util.setCode(data)
    }
} 
