module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
    const err = d.inside(inside)

	if (err) return d.error(err)

        const options = [
            timeout,
            guildID = d.message.guild.id
        ] = inside.splits

        if (isNaN(timeout)) return d.error(`:x: Invalid number in $setAFKTimeout${inside}`)

        const guild = d.client.guilds.cache.get(guildID)

        if (!guild) return d.error(`:x: Invalid guild ID in \`$setAFKTimeout${inside}\``)

        const set = await guild.setAFKTimeout(Number(timeout)).catch(err => {})

        if (!set) return d.error(`:x: Failed setting server AFK timeout!`)

        return {
            code: code.replaceLast(`$setAFKTimeout${inside}`, "")
        }
}