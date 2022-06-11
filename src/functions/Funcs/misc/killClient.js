module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.client.destroy();

    return {
        code: d.util.setCode(data)
    }
}