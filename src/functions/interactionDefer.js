/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [ephemeral = "false"] = data.inside.splits;

    await d.data.interaction?.deferReply({ ephemeral: ephemeral === "true" }).catch((e) => { d.aoiError.fnError(d, "custom", {}, "Failed to Defer Reply with Reason: " + e)});

    return {
        code: d.util.setCode(data),
    };
};
