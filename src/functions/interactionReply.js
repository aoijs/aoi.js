/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [content, allowedMentions = "all", ephemeral = "false", returnId = "false"] = data.inside.splits

    const parser = await d.util.errorParser(content, d);

    await d.data.interaction?.reply({
        content: parser.content?.trim() === "" ? " " : parser.content?.addBrackets() ?? parser.data?.content,
        embeds: parser.embeds ?? parser.data?.embeds,
        components: parser.components ?? parser.data?.components,
        files: parser.files ?? parser.data?.files,
        allowedMentions: {
            parse: allowedMentions === "all" ? [ "everyone", "users", "roles" ] : (allowedMentions ? allowedMentions?.split(",") : [])
        },
        ephemeral: ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed to Reply Interaction with Reason: " + e);
    })

    if (returnId === "true") data.result = (await d.data.interaction?.fetchReply())?.id ?? undefined;

    return {
        code: d.util.setCode(data)
    }
}
