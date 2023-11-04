module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content = "", embeds = "", components = "", files = "", ephemeral = "false", returnID = "false"] = data.inside.splits

    embeds = await d.util.parsers.EmbedParser(embeds);

    components = await d.util.parsers.ComponentParser(components, d.client);

    files = await d.util.parsers.FileParser(files);

    const i = await d.data.interaction?.followUp({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        ephemeral: ephemeral === "true" || ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    })

    data.result = returnID === "true" ? i?.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}
