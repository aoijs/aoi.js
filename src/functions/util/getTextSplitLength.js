module.exports = d => {
    const {code} = d.util.aoiFunc(d);

    return {
        code: d.util.setCode({function: d.func, code, result: d.array.length})
    }
}