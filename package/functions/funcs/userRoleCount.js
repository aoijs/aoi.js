module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const userID = inside.inside

        const m = await d.message.guild.members.fetch(userID).catch(Err => {})

        if (!m) return d.error(`:x: Invalid user ID in \`$userRoleCount${inside}\``)

        return {
            code: code.replaceLast(`$userRoleCount${inside}`, m.roles.cache.size - 1)  
        }
    } else {
        return {
            code: code.replaceLast(`$userRoleCount`, d.message.member.roles.cache.size - 1)
        }
    }
}