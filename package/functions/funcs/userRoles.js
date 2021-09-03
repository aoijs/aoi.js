module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const [
            userID,
            option = "names",
            separator = ", "
        ] = inside.splits

        const m = await d.message.guild.members.fetch(userID).catch(Err => {})

        if (!m) return d.error(`:x: Invalid user ID in \`$userRoles${inside}\``)

        const OPT = {
            names: "name",
            ids: "id",
            mentions: "toString"
        }[option.toLowerCase()] || "name"

        return {
            code: code.replaceLast(`$userRoles${inside}`, m.roles.cache.filter(r => r.id !== d.message.guild.id).sort((x, y) => y.position - x.position).map(r => OPT === "toString" ? r.toString() : r[OPT]).join(separator).deleteBrackets()) 
        }
    } else {
        return {
            code: code.replaceLast(`$userRoles`, d.message.member.roles.cache.filter(r => r.id !== d.message.guild.id).sort((x, y) => y.position - x.position).map(r => r.name).join(", ").deleteBrackets())
        }
    }
}