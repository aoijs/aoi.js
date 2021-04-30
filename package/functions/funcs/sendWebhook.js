//done
const Discord = require("discord.js")

const embed = require("../../handlers/errors")

module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [id, token, msg, ...options ] = inside.splits
    
    let embeds = []
    
    const m = await embed(d, msg, true)
    
    if (m.embed) embeds.push(m.embed)
    
    for (const option of options) {
        const opt = await embed(d, option, true) 
        
        if (opt.embed) embeds.push(opt.embed)
    }
    
    const web = new Discord.WebhookClient(id, token) 
    
    const webhook = await web.send(m.message, {
        embeds: embeds.length ? embeds : undefined 
    }).catch(err => null)
    
    if (!webhook) return d.error(`:x: Failed to send message with webhook`)
    
    return {
        code:code.replaceLast(`$sendWebhook${inside}`, "")
    }
}