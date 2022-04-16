module.exports = d => {
    const data = d.util.openFunc(d);

    return {
        code: d.util.setCode({function: d.func, code: data.code, result: d.data.interaction?.isButton})
    }
}