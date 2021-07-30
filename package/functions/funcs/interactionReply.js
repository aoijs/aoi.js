const ComponentParser = require('../../handlers/componentParser.js')
const embed = require("../../handlers/errors")
module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const fields = inside.splits
    let fie = fields
    let [c,e, components="",flags=0,type=4] = fields
 
    const m = await embed(d, fie.shift(), true) 
    
    const embeds = m.embed ? [m.embed.toJSON()] : [] 
    
    for (const field of fie) {
        const m = await embed(d, field, true) 
        
        if (m.embed) embeds.push(m.embed.toJSON())
    }
const com =components === "" ? [] : await ComponentParser (components||"")
   
    if (d.data.interaction) {
        const msg = await d.data.interaction.reply(m.message, embeds, com,flags,type)
    }
    
    return {
        code: code.replaceLast(`$interactionReply${inside}`, "")
    }
}
