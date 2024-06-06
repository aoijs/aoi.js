module.exports = d => {
    let {code, result} = d.util.aoiFunc(d);

    result = d.mentions.channels.size;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}