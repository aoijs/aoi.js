
module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [content = "", embeds = "", components = "", files = "", ephemeral = "false"] = inside.splits
    embeds = await d.util.parsers.EmbedParser(embeds);
    components = await d.util.parsers.ComponentParser(components, d.client);
    files = await d.util.parsers.FileParser(files);
    await d.data.interaction?.followUp({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        ephemeral: ephemeral === "true" || ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    })
    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}