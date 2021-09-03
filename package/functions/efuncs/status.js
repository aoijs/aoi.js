module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const user = await d.client.users.fetch(inside.inside).catch(err => {})

        if (!user) return d.error(`:x: Invalid user ID in \`$status${inside}\``)

        if (!user.presence) return d.error(`:x: No presence status`)

        return {
            code: code.replaceLast(`$status${inside}`, user.presence.status ? user.presence.status || "" : "")
        }
    } else {
        return {
            code: code.replaceLast(`$status`, d.message.author.presence ? d.message.author.presence.status || "" : "")
        }
    }

}