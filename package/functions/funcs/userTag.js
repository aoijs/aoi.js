module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const user = await d.client.users.fetch(inside.inside).catch(err => {})

        if (!user) return d.error(`:x: Invalid user ID in \`$userTag${inside}\``)

        return {
            code: code.replaceLast(`$userTag${inside}`, user.tag.removeBrackets())
        }
    } else {
        return {
            code: code.replaceLast(`$userTag`, d.message.author.tag.removeBrackets())
        }
    }
}