module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
    const err = d.inside(inside)

	if (err) return d.error(err)

        const options = [
            channelID,
            guildID = d.message.guild.id
        ] = inside.splits
        
        const channel = d.client.channels.cache.get(channelID)

        if (!channel) return d.error(`:x: Invalid guild ID in \`$setAFKChannel${inside}\``)

        if (channel.type !== "voice")  return d.error(`:x: AFK channel ID must be a voice channel!`)

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$setAFKChannel${inside}\``)

        const set = await guild.setAFKChannel(channel).catch(err => {})

        if (!set) return d.error(`:x: Failed setting server AFK channel!`)

        return {
            code: code.replaceLast(`$setAFKChannel${inside}`, "")
        }
}