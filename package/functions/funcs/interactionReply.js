const embed = require("../../handlers/errors")
module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const fields = inside.splits
    
    const m = await embed(d, fields.shift(), true) 
    
    const embeds = m.embed ? [m.embed.toJSON()] : [] 
    
    for (const field of fields) {
        const m = await embed(d, field, true) 
        
        if (m.embed) embeds.push(m.embed.toJSON())
    }
    
    if (d.data.interaction) {
        const msg = await d.data.interaction.reply(m.message, embeds) 
        //if (! msg) return d.error(`❌ Failed to reply to slash command!`
    }
    
    return {
        code: code.replaceLast(`$interactionReply${inside}`, "")
    }
}