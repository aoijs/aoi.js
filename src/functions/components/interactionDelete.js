/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    await d.data.interaction?.deleteReply().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Delete Interaction with Reason: " + e)
    });

    return {
        code: d.util.setCode(data)
    }
} 