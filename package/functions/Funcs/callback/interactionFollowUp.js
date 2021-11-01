const {ComponentParser,EmbedParser,FileParser} = require('../../../Handler/parsers.js')
module.exports = async d => {
    const code = d.command.code 
    const inside = d.unpack()
	const err = d.inside(inside)
	if (err) return d.error(err)
    let [content="",embeds="", components="",files = "",ephemeral="no"] = inside.splits
  embeds = embeds.addBrackets()
  embeds = await EmbedParser(embeds)
  components =await ComponentParser(components,d.client)
    files = await FileParser(files);
    d.data.interaction?.followUp({content:content.trim() === "" ? " ": content.addBrackets(),embeds:embeds,components: components,files, ephemeral: ephemeral === "yes" || ephemeral === "true"})
    return {
        code: d.util.setCode({ function : d.func,code,inside }) 
    }
}