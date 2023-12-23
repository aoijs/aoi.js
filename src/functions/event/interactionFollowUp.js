module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content = "", embeds = "", components = "", files = "", ephemeral = "false", returnId = "false"] = data.inside.splits

    embeds = await d.util.parsers.EmbedParser(embeds, d);

    components = await d.util.parsers.ComponentParser(components, d);

    files = await d.util.parsers.FileParser(files, d);

    const interaction = await d.data.interaction?.followUp({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        ephemeral: ephemeral === "true" || ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    })

    if (returnId === "true") data.result = interaction?.id ?? undefined;

    return {
        code: d.util.setCode(data)
    }
}
