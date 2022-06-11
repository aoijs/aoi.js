module.exports = d => {
    const data = d.util.aoiFunc(d);

    return {
        code: d.util.setCode({function: d.func, code: data.code, result: d.data.interaction?.isMessageComponent})
    }
}