const permissions = require("../../utils/permissions") 

module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
 const [channelID, userID, ...perms] = inside.splits 
 
 const channel = d.client.channels.cache.get(channelID) 
 
 const user = await d.client.users.fetch(userID).catch(err => null) 
 
 if (!channel || !user) return d.error(`❌ Invalid channel or user ID in \`$hasPermsInChannel${inside}\``) 
 
 const pms = perms.map(key => permissions[key]) 
 
 if (pms.includes(undefined)) return d.error(`❌ Invalid permissions in \`$hasPermsInChannel${inside}\``) 
 
 const upms = channel.permissionsFor(userID) 
 
 return {
 code: code.replaceLast(`$hasPermsInChannel${inside}`, upms && pms.every(p => upms.has(p)))
 }
}