module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [webhookID, webhookToken] = inside.splits
    
    const webhook = await d.client.fetchWebhook(webhookID, webhookToken).catch(err => null) 
    
    return {
        code: code.replaceLast(`$webhookExists${inside}`, webhook ? true : false)
    }
}