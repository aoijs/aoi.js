/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);

    const [option] = data.inside.splits;

    try {
        if(option){
            data.result = eval(`d.data.awaitData?.${option}`);
        } else {
            data.result = eval(`d.data.awaitData`);
        }
    } catch (e){
        return d.aoiError.fnError(d, "custom", {}, e);
    }
    return {
        code: d.util.setCode(data),
    };
};
