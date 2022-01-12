const {ComponentParser, EmbedParser, FileParser} = require('../../../handler/parsers.js')
module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [content = "", embeds = "", components = "", files = "", allowedMentions = "", ephemeral = "no"] = inside.splits
    embeds = await EmbedParser(embeds)
    components = await ComponentParser(components, d.client)
    files = await FileParser(files);
    allowedMentions = allowedMentions === "all" ? ["everyone", "users", "roles"] : allowedMentions?.split(",") || [];
    await d.data.interaction?.reply({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        allowedMentions: {
            parse: allowedMentions
        },
        ephemeral: ephemeral === "yes" || ephemeral === "true"
    })

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}
