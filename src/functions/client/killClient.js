module.exports = d => {
    const data = d.util.aoiFunc(d);

    d.client.destroy();

    return {
        code: d.util.setCode(data)
    }
}