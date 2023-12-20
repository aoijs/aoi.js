module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = Date.now() - d.message?.createdTimestamp

    return {
        code: d.util.setCode(data)
    }
}