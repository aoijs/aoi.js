module.exports = async d => {
    const code = d.command.code

    const r = code.split("$isRoleManaged").length - 1

    const inside = code.split("$isRoleManaged")[r].after()

    const role = d.message.guild.roles.cache.get(inside.inside)

    if (!role) return d.error(`\`${d.func}: Invalid role ID in ${inside}\``)

    return {
        code: code.replaceLast(`$isRoleManaged${inside}`, role.managed)
    }
}
