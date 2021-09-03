const {ComponentParser,EmbedParser,FileParser} = require('../../Handler/parsers.js')
module.exports = async d => {
    const code = d.command.code 
    const inside = d.unpack()
	const err = d.inside(inside)
	if (err) return d.error(err)
    let [content,embeds=[], components=[],files=[]] = inside.splits
  embeds = await EmbedParser(embeds)
  components =await ComponentParser(components)
  files = await FileParser(files)
    d.data.interaction?.update({content:content,embeds:embeds,components: components, files:files})
    return {
        code: code.replaceLast(`$interactionUpdate${inside}`, "")
    }
}