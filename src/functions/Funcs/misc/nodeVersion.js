module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = process.version;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}