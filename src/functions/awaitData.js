/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    const [option] = data.inside.splits;

    try {
        data.result = eval(`d.data.awaitData?.${option.addBrackets()}`);
    } finally{
        data.result = eval(`d.data.awaitData`);
    }
    return {
        code: d.util.setCode(data),
    };
};
