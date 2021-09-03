module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

        const options = [
            days = 7,
            guildID = d.message.guild.id,
            reason = `none` ,
            roleIDs,
            returnCount = `no`
        ] = inside.splits

        if (isNaN(days)) return d.error(`:x: Invalid number in \`$pruneMembers${inside}\``)

        var Roles = [];

        if (roleIDs) {
        for (const role of roleIDs.split(" ").join("").split(":")) {
            let roleExist = d.message.guild.roles.cache.get(role)
            if (!roleExist) return d.error(`:x: Role with ID \`${role}\` not found`)
            const r = await Roles.push(role)
        }
    }

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$getAuditLogs${inside}\``)

        const prune = await guild.members.prune({ days: Number(days), reason: reason, roles: Roles, count: returnCount === `no` ? false : true }).catch(err => {})

        return {
            code: code.replaceLast(`$pruneMembers${inside}`, prune || "")
        }
}