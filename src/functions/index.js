/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const i = d?.data.index;

    if (!i && i !== 0) return d.aoiError.fnError(d, 'custom', {}, 'No loop command.');

    data.result = Number(i) + 1;
    
    return {
        code: d.util.setCode(data),
    };
};
