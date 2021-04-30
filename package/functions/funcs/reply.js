const embed = require("../../handlers/errors")

module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [messageID, msg, mention = "yes"] = inside.splits
    
    const m = await embed(d, msg, true) 
    
    await d.client.api.channels(d.message.channel.id).messages.post({
        data: {
            content: m.message || "", 
            embed: m.embed, 
            files: m.embed ? m.embed.files : undefined, 
            message_reference: {
                message_id: messageID 
            }, 
            allowed_mentions: {
      			replied_user: mention === "yes",
	  			parse: d.disabledMentions
    		}
        }
    })
    
    return {
        code: code.replaceLast(`$reply${inside}`, "")
    }
}
