module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = process.version;
    return {
        code: d.util.setCode(data)
    }
}