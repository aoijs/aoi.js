
module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [content = "", embeds = "", components = "", files = "", allowedMentions = "all", ephemeral = "false"] = inside.splits
    embeds = await d.util.parsers.EmbedParser(embeds);
    components = await d.util.parsers.ComponentParser(components, d.client);
    files = await d.util.parsers.FileParser(files);
    allowedMentions = allowedMentions === "all" ? [ "everyone", "users", "roles" ] : allowedMentions?.split( "," ) || [];
    // console.log({content, embeds, components, files, allowedMentions, ephemeral})
    await d.data.interaction?.reply({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        allowedMentions: {
            parse: allowedMentions
        },
        ephemeral: ephemeral === "true" || ephemeral === "true"
    })

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}
