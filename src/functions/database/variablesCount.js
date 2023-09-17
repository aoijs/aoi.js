module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.variableManager.size;

    return {
        code: d.util.setCode(data)
    }
}