module.exports = async d => {
    const code = d.command.code

    const r = code.split("$highestRole").length - 1

    const after = code.split("$highestRole")[r].after()

    if (after.inside) {
        const inside = after.inside

        const member = await d.message.guild.members.fetch(inside).catch(err => {})

        if (!member) return d.error(`\`${d.func}: Invalid user ID in ${after}\``)

        else return {
            code: code.replaceLast(`$highestRole${after}`, member.roles.highest.id)
        }
    } else {
        return {
            code: code.replaceLast(`$highestRole`, d.message.member.roles.highest.id)
        }
    }
}