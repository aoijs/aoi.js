module.exports = d => {
    let {code, result} = d.util.aoiFunc(d);

    result = d.message?.reference?.guildId;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}