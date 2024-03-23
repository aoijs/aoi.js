module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [content, ephemeral = "false", returnId = "false"] = data.inside.splits

    const parser = await d.util.errorParser(content, d);

    const interaction = await d.data.interaction?.followUp({
        content: parser.content?.trim() === "" || !parser.content ? " " : parser.content.addBrackets(),
        embeds: parser.embeds,
        components: parser.components,
        files: parser.files,
        ephemeral: ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Follow Up Interaction with Reason: " + e);
    })

    if (returnId === "true") data.result = interaction?.id ?? undefined;

    return {
        code: d.util.setCode(data)
    }
}
