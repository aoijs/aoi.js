module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const i = d?.data.index;

    if (!i && i !== 0) return d.aoiError.fnError(d, 'custom', {}, 'No loop command.');

    data.result = Number(i);
    
    return {
        code: d.util.setCode(data),
    };
};
