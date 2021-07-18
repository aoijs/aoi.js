module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

    if (inside.inside) {
        const member = await d.message.guild.members.fetch(inside.inside).catch(err => {})

        if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

        else return {
            code: code.replaceLast(`$lowestRole${inside}`, (member.roles.cache.sort((x, y) => x.position - y.position).array().slice(1)[0] || "").id || "")
        }
    } else {
        return {
            code: code.replaceLast(`$lowestRole`, (d.message.member.roles.cache.sort((x, y) => x.position - y.position).array().slice(1)[0] || "").id || "")
        }
    }
}