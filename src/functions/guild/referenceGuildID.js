module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.message?.reference?.guildId;

    return {
        code: d.util.setCode(data)
    }
}