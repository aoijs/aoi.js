const embed = require("../../handlers/errors")

module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [messageID, mention = "yes"] = inside.splits
    d.allowedMentions.repliedUser = mention === "yes" 
    
    
    return {
        code: code.replaceLast(`$reply${inside}`, ""),
        reply :{message:messageID,user:mention === "yes"},
        allowedMentions:d.allowedMentions
    }
}
