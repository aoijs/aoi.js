const {ComponentParser, EmbedParser, FileParser} = require('../../../handler/parsers.js')
module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
    const err = d.inside(inside)
    if (err) return d.error(err)
    let [content = "", embeds = "", components = "", files = "", ephemeral = "no"] = inside.splits
    embeds = await EmbedParser(embeds)
    components = await ComponentParser(components, d.client)
    files = await FileParser(files);
    await d.data.interaction?.followUp({
        content: content.trim() === "" ? " " : content.addBrackets(),
        embeds: embeds,
        components: components,
        files,
        ephemeral: ephemeral === "yes" || ephemeral === "true"
    }).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Reply With Reason: ' + e)
    })
    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}