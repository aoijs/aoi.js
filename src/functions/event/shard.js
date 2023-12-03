module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = eval(`d.data.shard.${option}`);

    return {
        code: d.util.setCode(d),
    };
};
