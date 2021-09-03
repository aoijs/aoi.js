const ms = require("ms")
const interpreter = require("../../interpreter.js")
module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [
        messageID,
        userFilter,
        time,
        reactionOrReactions,
        commandOrCommands,
        removeReactions = "no"
    ] = inside.splits

    if (!time) return d.error(`:x: Not enough fields in \`$reactionCollector${inside}\``)
  
    if (!ms(time)) return d.error(`:x: Failed to parse '${time}' in \`$reactionCollector${inside}\``)

    const msg = await d.message.channel.messages.fetch(messageID).catch(err => {})

    if (!msg) return d.error(`:x: Invalid message ID in \`$reactionCollector${inside}\``)

    for (const reaction of reactionOrReactions.split(" ").join("").split(",")) {
        const r = await msg.react(reaction.addBrackets()).catch(Err => null)

        if (!r) return d.error(`:x: Failed to react with '${reaction}'`)
    }

    const filter = (reaction, user) => {
        return reactionOrReactions.split(" ").join("").split(",").some(rc => rc.includes(reaction.emoji.name) || rc.includes(reaction.emoji.id)) && d.client.user.id !== user.id && userFilter === "everyone" ? true : user.id === userFilter
    }

    const collector = msg.createReactionCollector(filter, {
        time: ms(time)
    })

    collector.on("collect", async (reaction, user) => {

        if(!reactionOrReactions.includes(reaction.emoji.name) && !reactionOrReactions.includes(reaction.emoji.id)) return ;

        if (user.partial) {
            await user.fetch()
        } 
        
        if (removeReactions === "yes") {
            reaction.users.remove(user.id).catch(err => {})
        }

        const command = commandOrCommands.split(" ").join("").split(",")[reactionOrReactions.split(" ").join("").split(",").findIndex(rc => rc.includes(reaction.emoji.name) || rc.includes(reaction.emoji.id))]

        if (!command) return d.error(`:x: Command '${command}' not found! (internal error)`)
    
        const cmd = d.client.awaited_commands.find(c => c.name === command)
    
        if (!cmd) return d.error(`:x: Command '${command}' not found!`)
        
        const { type, flags, createdTimestamp, createdAt, reference, partial, pinnable } = d.message 
        
        await interpreter(d.client, {
            type, flags, reference, partial, createdTimestamp, createdAt, pinnable, 
            author: user,
            guild: d.message.guild, 
            id: d.message.id,
            channel: d.message.channel,
            mentions: d.message.mentions,
            reactions: d.message.reactions,
            member: await d.message.guild.members.fetch(user.id),
		    message: msg
        }, [messageID], cmd)
    })

    return {
        code: code.replaceLast(`$reactionCollector${inside}`, "")
    }
}
