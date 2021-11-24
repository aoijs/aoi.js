module.exports = d => {
    const {code} = d.util.openFunc(d);

    return {
        code: d.util.setCode({function: d.func, code, result: d.array.length})
    }
}