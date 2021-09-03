const embed = require("../../handlers/errors")
module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [msg, ...channelIDs] = inside.splits
    
    channelIDs.map(async id => {
        const channel = d.client.channels.cache.get(id) 
        
        if (channel) await embed(d, msg, false, channel) 
    })
    
    return {
        code: code.replaceLast(`$sendCrosspostingMessage${inside}`, "")
    }
}