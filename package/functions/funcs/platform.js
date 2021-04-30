module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const [
            userID,
            separator = ", "
        ] = inside.splits

        const user = await d.client.users.fetch(userID).catch(Err => {})

        if (!user) return d.error(`:x: Invalid user ID in \`$platform${inside}\``)
        
        return {
            code: code.replaceLast(`$platform${inside}`, !user.presence.clientStatus || user.presence.status === "offline" ? "none" : Object.keys(user.presence.clientStatus || {none:'none'}).join(separator))
        }
    } else {
        return {
            code: code.replaceLast(`$platform`, d.message.author.presence.status === "offline" || !d.message. author.presence.status ? "none" : Object.keys(d.message.author.presence.clientStatus || {none:'none'}).join(", "))
        }
    }
}