module.exports = async d => {
    const {code} = d.util.openFunc(d);

    return {
        code: d.util.setCode({function: d.func, code, result: Math.abs( Date.now() - d.data.interaction?.createdTimestamp) })
    }
}