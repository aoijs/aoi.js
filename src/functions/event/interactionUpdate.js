
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content = "", embeds = "", components = "", files = ""] = data.inside.splits

    embeds = await d.util.parsers.EmbedParser(embeds, d);

    components = await d.util.parsers.ComponentParser(components, d);

    files = await d.util.parsers.FileParser(files, d);

    await d.data.interaction?.update({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files
    }).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    })

    return {
        code: d.util.setCode(data)
    }
}
