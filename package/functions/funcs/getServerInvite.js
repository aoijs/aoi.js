module.exports = async d => {
    const code = d.command.code

    const r = code.split("$getServerInvite").length - 1

    const after = code.split("$getServerInvite")[r].after()

    if (after.inside) {
        const guildID = after.inside

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`\`${d.func}: Invalid guild ID in ${after}\``)

        const channel = guild.channels.cache.find(ch => ch.type === "text" && ch.permissionsFor(d.client.user.id).has("CREATE_INSTANT_INVITE"))

        let invite

        if (channel) invite = await channel.createInvite().catch(Err => {})

        return {
            code: code.replaceLast(`$getServerInvite${after}`, invite ? invite.toString() : "missing permissions")   
        }
    } else {
        const channel = d.message.guild.channels.cache.find(ch => ch.type === "text" && ch.permissionsFor(d.client.user.id).has("CREATE_INSTANT_INVITE"))

        let invite 

        if (channel) invite = await channel.createInvite().catch(Err => {})

        return {
            code: code.replaceLast(`$getServerInvite`, invite ? invite.toString() : "missing permissions")   
        }
    }
}