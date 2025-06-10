/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    await d.data.interaction?.deferUpdate().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Defer Update with Reason: " + e)
    });

    return {
        code: d.util.setCode(data)
    }
}
