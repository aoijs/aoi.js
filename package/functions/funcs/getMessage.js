module.exports  =async d => {
    const code = d.command.code

    const r = code.split("$getMessage").length - 1

    const inside = code.split("$getMessage")[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $getMessage${inside}`)

    const [
        channelID,
        messageID,
        option = "content"
    ] = inside.splits

    const options = {
        content: "content || \"\"",
        description: "embeds[0] ? embeds[0].description || '' : ''",
        userID: "author.id"
    }[option]
    
    if (!options) return d.error(`:x: Invalid option in \`$getMessage${inside}\``)

    const channel = d.client.channels.cache.get(channelID)

    if (!channel) return d.error(`:x: Invalid channel ID in \`$getMessage${inside}\``)

    const msg = await channel.messages.fetch(messageID).catch(Err => {})

    if (!msg) return d.error(`:x: Invalid message ID in \`$getMessage${inside}\``)

    return {
        code: code.replaceLast(`$getMessage${inside}`, eval(`msg.${options}`).deleteBrackets())
    }
}