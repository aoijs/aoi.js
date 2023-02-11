module.exports = d => {
    const data = d.util.aoiFunc(d);
    const [format = "true"] = data.inside.splits;

    data.result = JSON.stringify(d.object, null, format === "true" ? 2 : 0)
    return {
        code: d.util.setCode(data)
    }

}