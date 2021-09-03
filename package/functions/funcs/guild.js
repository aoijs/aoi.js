const moment = require("moment");
const ms = require('parse-ms');

module.exports = async d => {
    let code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
    let [id, opt] = inside.splits
    
    let server = (d.client.guilds.cache.get(id ? id : d.message.guild.id))
let data = {} 
 Object.assign(data,server)   
 delete data.client 
 data.icon = server.iconURL() 
 data.features = data.features.join(" , ") 
 data.commands =data.commands.cache.size 
 delete data.members 
 data.channels = data.channels.cache.size 
 data.bans = data.bans.cache.size
 data.roles = data.roles.cache.size 
 delete data.presence 
 delete data.voiceStates 
 delete data.stageInstances 
 data.invites = data.invites.size 
 data.systemChannelFlags = (data.systemChannelFlags.toArray.join(" ") === "" ? "none" : data.systemChannelFlags.toArray.join(" ") ) 
data.owner = server.members.cache.get(data.ownerId).username 
delete data.shard 
delete data.afkChannel 
delete data.systemChannel 
delete data.me 
delete data.voiceAdapterCreator 
delete data.publicUpdatesChannel 
data.joinAt = data.joinAt.toString() 
data.emojis = data.emojis.cache.size 
data.stickers = data.stickers.cache.size 
    return {
        code: code.replaceLast(`$guild${inside}`,data[opt]?.addBrackets()??"")
    }
}
