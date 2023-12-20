module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [func] = data.inside.splits;

    data.result = eval(
        Array.isArray(d.data.track)
            ? `d.data.track[${func}]`
            : `d.data.track.${func}`,
    );

    return {
        code: d.util.setCode(data),
    };
};
