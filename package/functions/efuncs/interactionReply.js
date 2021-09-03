const {ComponentParser,EmbedParser} = require('../../Handler/parsers.js')
module.exports = async d => {
    const code = d.command.code 
    const inside = d.unpack()
	const err = d.inside(inside)
	if (err) return d.error(err)
    let [content="",embeds="", components="",ephemeral=false] = inside.splits
  embeds = embeds.addBrackets()
  embeds = await EmbedParser(embeds)
  components =await ComponentParser(components)
    d.data.interaction?.reply({content:content.trim() === "" ? " ": content.addBrackets(),embeds:embeds,components: components, ephemeral: ephemeral.replace("yes",true).replace("no",false).replace("true",true).replace("false",false)})
    return {
        code: code.replaceLast(`$interactionReply${inside}`, "")
    }
}