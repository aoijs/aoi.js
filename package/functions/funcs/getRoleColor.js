module.exports = async d => {
    const code = d.command.code

    const r = code.split("$getRoleColor").length - 1

    const inside = code.split("$getRoleColor")[r].after()

    const role = d.message.guild.roles.cache.get(inside.inside)

    if (!role) return d.error(`\`${d.func}: Invalid role ID in ${inside}\``)

    return {
        code: code.replaceLast(`$getRoleColor${inside}`, role.hexColor)
    }
}