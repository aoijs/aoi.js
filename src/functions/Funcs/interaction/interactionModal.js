
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [title, customID, components] = data.inside.splits;

    const parsedComponents = await d.util.parsers.ComponentParser(components, d.client);

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
                "Failed to render modals with reason: " + e,
            );
        });

    return {
        code: d.util.setCode(data),
    };
};