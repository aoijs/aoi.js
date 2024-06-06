module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = d.guild?.shardId || 0;

    return {
        code: d.util.setCode(data)
    }
}