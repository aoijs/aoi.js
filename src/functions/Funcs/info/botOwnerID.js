module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [seperator = " , "] = data.inside.splits;

    data.result = d.client.aoiOptions.Owner.join(seperator);
    return {
        code: d.util.setCode(data)
    }
} 