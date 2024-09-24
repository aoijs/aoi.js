
/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [content] = data.inside.splits

    const parser = await d.util.errorParser(content, d)

    await d.data.interaction?.update({
        content: parser.content?.trim() === "" ? " " : parser.content?.addBrackets() ?? parser.data?.content,
        embeds: parser.embeds ?? parser.data?.embeds,
        components: parser.components ?? parser.data?.components,
        files: parser.files ?? parser.data?.files
    }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Reply Interaction with Reason: " + e)
    })

    return {
        code: d.util.setCode(data)
    }
}
