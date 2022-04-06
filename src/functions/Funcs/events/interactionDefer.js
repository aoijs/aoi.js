module.exports = async (d) => {
    const data = d.util.openFunc(d);
    const [ephemeral = "no"] = data.inside.splits;
    await d.data.interaction
        ?.deferReply({ephemeral: ephemeral === "yes"})
        .catch((e) => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Reply With Reason: " + e);
        });

    return {
        code: d.util.setCode({
            function: d.func,
            code: data.code,
            inside: data.inside,
        }),
    };
};
