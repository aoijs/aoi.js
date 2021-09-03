module.exports = async d => {
    const code = d.command.code

    const after = d.unpack()

    if (after.inside) {
        const inside = after.inside

        const user = await d.client.users.fetch(inside).catch(Err =>{})

        if (!user) return d.error(`:x: Invalid user ID in \`$isBot${after}\``)

        return {
            code: code.replaceLast(`$isBot${after}`, user.bot)
        }
    } else {
        return {
            code: code.replaceLast(`$isBot`, d.message.author.bot)
        }
    }
}