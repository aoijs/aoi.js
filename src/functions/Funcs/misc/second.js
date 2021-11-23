module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = new Date(new Date().toLocaleString('en-us', {timeZone: d.timezone})).getSeconds();

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}