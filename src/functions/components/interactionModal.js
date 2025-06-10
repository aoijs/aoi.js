/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [title, customID, components] = data.inside.splits;

    const parsedComponents = await d.util.parsers.ComponentParser(components, d);

    await d.data.interaction
        .showModal({
            title: title.addBrackets(),
            customId: customID.addBrackets(),
            components: parsedComponents,
        })
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed to render modals with Reason: " + e,
            );
        });

    return {
        code: d.util.setCode(data),
    };
};