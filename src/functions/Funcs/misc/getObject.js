module.exports = d => {
    const data = d.util.aoiFunc(d);
    const [format = "yes"] = data.inside.splits;

    data.result = JSON.stringify(d.object, null, format === "yes" ? 2 : 0)
    return {
        code: d.util.setCode(data)
    }

}