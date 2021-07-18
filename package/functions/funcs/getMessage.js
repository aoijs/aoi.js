module.exports  =async d => {
    const code = d.command.code

    const r = code.split("$getMessage").length - 1

    const inside = code.split("$getMessage")[r].after()

    const err = d.inside(inside);

    if (err) return d.error(err);

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
    
    if (!options) return d.error(`\`${d.func}: Invalid option in ${inside}\``)

    const channel = d.client.channels.cache.get(channelID)

    if (!channel) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)

    const msg = await channel.messages.fetch(messageID).catch(Err => {})

    if (!msg) return d.error(`\`${d.func}: Invalid message ID in ${inside}\``)

    return {
        code: code.replaceLast(`$getMessage${inside}`, eval(`msg.${options}`).deleteBrackets())
    }
}