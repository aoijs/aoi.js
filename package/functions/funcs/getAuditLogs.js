module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

        const options = [
            limit = 5,
            userID,
            action = `ALL`,
            guildID = d.message.guild.id,
            format = `{executor.username} - {target.id} - {action}`
        ] = inside.splits

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$getAuditLogs${inside}\``)

        const user = userID ? (await d.client.users.fetch(userID).catch(d.noop) || null) : null

        const audit = await guild.fetchAuditLogs({limit: limit, user: user, type: action})

        if (!audit) return d.error(`:x: Failed fetching audit logs!`)
        
        const text = audit.entries.map(logs => format.replace(`{executor.username}`, logs.executor.username).replace(`{executor.mention}`, logs.executor).replace(`{executor.id}`, logs.executor.id).replace(`{executor.tag}`, logs.executor.tag).replace("{target.id}", logs.id).replace("{action}", logs.action)).join('\n')

        return {
            code: code.replaceLast(`$getAuditLogs${inside}`, text)
        }
}
