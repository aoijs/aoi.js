module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = d.guild?.shardId || 0;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}