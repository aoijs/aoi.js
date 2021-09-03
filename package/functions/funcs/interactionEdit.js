const {EmbedParser,ComponentParser} = require('../../Handler/parsers.js')
module.exports = async d => {
    const code = d.command.code
    const inside = d.unpack()
	const err = d.inside(inside)
	if (err) return d.error(err) 
    let [c,e=[], components=[]] = inside.splits
 e = await EmbedParser(e) 
 components = await ComponentParser(components)
      await d.data.interaction?.editReply(c, e, components)    
    return {
        code: code.replaceLast(`$interactionEdit${inside}`, "")
    }
}
