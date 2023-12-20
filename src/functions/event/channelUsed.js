module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.channelUsed;

    return {
        code: d.util.setCode(data)
    }
}