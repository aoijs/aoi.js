module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [content = "", embeds = "", components = "", files = "", ephemeral = "false"] = data.inside.splits

    const Checker = (theparts, name) => theparts.includes("{" + name + ":");

    embeds = await d.util.parsers.EmbedParser.code(d, { part: embeds, Checker });

    components = await d.util.parsers.ComponentParser.code(d, { part: components, Checker });

    files = await d.util.parsers.FileParser.code(d, { part: files, Checker });

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
        code: d.util.setCode(data)
    }
}
