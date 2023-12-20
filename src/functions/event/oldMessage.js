module.exports = async d => {
    let {code, result} = d.util.aoiFunc(d);

    result = d.data.oldm?.content;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}
