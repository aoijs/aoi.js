const moment = require("moment")

module.exports = async d => {
    const code = d.command.code 

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
    const fields = inside.splits

    let url = fields[0]

    let split = url.split("/")
    
    let id = split[5]
    
    let token = split[6]
    
    const hook = await d.client.fetchWebhook(id, token).catch(err => null)
    
    let opt = fields[1]

    if (!hook && (opt != "exists")) return d.error(`❌ Invalid webhookURL in 1st field of \`$webhook${inside}\``) 

 if(!opt) return d.error(`:x: Missing option in 2nd field of \`$webhook${inside}\`.`)
 if(![
    "avatar",
    "channelid",
    "created",
    "id",
    "server",
    "name",
    "token",
    "type",
    "url",
    "exists"
].includes(opt.toLowerCase())) return d.error(`:x: Invalid option in 2nd field of \`$webhook${inside}\`.`)

switch (opt) {
    case "avatar": opt = `https://cdn.discordapp.com/avatars/${hook.id}/${hook.avatar}.png`
        break;
    case "channelid": opt = hook.channelID
        break;
    case "created": opt = moment(hook.createdAt).format("LLLL")
        break;
    case "id": opt = hook.id
        break;
    case "name": opt= hook.name
        break;
    case "token": opt = hook.token
        break;
    case "type": opt = hook.type
        break;
    case "url": opt = hook.url
        break;
    case "guild": opt = hook.guildID
        break;
    case "exists": opt = hook ? true : false
        break;
    default: undefined
        break;
}

        return {
            code: code.replaceLast(`$webhook${inside}`, opt)
        }
    }