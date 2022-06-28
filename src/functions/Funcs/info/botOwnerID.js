module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [separator = " , "] = data.inside.splits;

    data.result = d.client.aoiOptions.Owner.join(separator);
    return {
        code: d.util.setCode(data)
    }
} 