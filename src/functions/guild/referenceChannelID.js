module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.message?.reference.channelId

    return {
        code: d.util.setCode(data)
    }
}