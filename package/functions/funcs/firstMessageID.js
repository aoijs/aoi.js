module.exports = async (d) => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const channelID = await d.client.channels.cache.get(inside.inside)

        if (!channelID) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``)
        const fetchMessages = await channelID.messages.fetch({
            after: 1,
            limit: 1
        });
        const fmsg = fetchMessages.first();

        return {
            code: code.replaceLast(`$firstMessageID${inside}`, fmsg.id.removeBrackets())
        }
    } else if(!inside.inside) {
        const fetchMessages = await d.message.channel.messages.fetch({
            after: 1,
            limit: 1
        });
        const fmsg = fetchMessages.first();
        return {
            code: code.replaceLast(`$firstMessageID`, fmsg.id.removeBrackets())
        }
    }
}
