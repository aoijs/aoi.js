/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = d.data.interaction?.isMessageComponent();

    return {
        code: d.util.setCode(data)
    }
}