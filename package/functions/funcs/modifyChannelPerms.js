const keyPerms = require("../../utils/permissions")

module.exports = async d => {
    try {
        const code = d.command.code

        const inside = d.unpack()
		const err = d.inside(inside)

		if (err) return d.error(err)
    
        const fields = inside.splits
    
        const channelID = fields.shift()
        //gay
        const roleOrUser = fields.pop()

        const perms = fields
    
        const channel = d.message.guild.channels.cache.get(channelID)
    
        if (!channel) return d.error(`:x: Invalid channel ID in \`$modifyChannelPerms${inside}\``)
        
        if (!perms.every(perm => Object.keys(keyPerms).includes(perm.slice(1)))) return d.error(`:x: Invalid permission in \`$modifyChannelPerms${inside}\``)
    
        const allow = perms.filter(perm => perm[0] === "+").map(perm => keyPerms[perm.slice(1)])
    
        const deny = perms.filter(perm => perm[0] === "-").map(perm => keyPerms[perm.slice(1)])
    
        const nulled = perms.filter(perm => perm[0] === "/").map(perm => keyPerms[perm.slice(1)])

        const chAllow = channel.permissionOverwrites.get(roleOrUser) ? channel.permissionOverwrites.get(roleOrUser).allow.toArray().filter(perm => !deny.includes(perm)) : []
    
        const chDeny = channel.permissionOverwrites.get(roleOrUser) ? channel.permissionOverwrites.get(roleOrUser).deny.toArray().filter(perm => !allow.includes(perm)) : []
    
        for (const p of allow) {
            if (!chAllow.includes(p)) chAllow.push(p)
        }
    
        for (const p of deny) {
            if (!chDeny.includes(p)) chDeny.push(p)
        }
    
        const permsObject = new Object()

        for (const perm of chDeny) {
            permsObject[perm] = false
        }

        for (const perm of chAllow) {
            permsObject[perm] = true
        }

        for (const perm of nulled) {
            permsObject[perm] = null
        }

        const ch = await channel.updateOverwrite(roleOrUser, permsObject).catch(err => err.message)
    
        if (typeof ch === "string") {
            return d.error(`:x: Could not modify channel permissions! in \`$modifyChannelPerms${inside}\`\nError: ${ch}`)
        }

        if (!ch) return d.error(`:x: Could not modify channel permissions! in \`$modifyChannelPerms${inside}\``)
    
    
        return {
            code: code.replaceLast(`$modifyChannelPerms${inside}`, "")
        }
    } catch (error) {
        return d.error(`:x: ${error.message} in $modifyChannelPerms`)
    }
}