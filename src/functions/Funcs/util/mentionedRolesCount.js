module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = d.mentions.roles.size;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}