const permissions = require("../../utils/permissions.js")

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits
    const userID = fields.shift()

    const member = await d.message.guild.members.fetch(userID).catch(err => {})

    if (!member) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)

    const reqPerms = []

    for (const field of fields) {
        const perm = permissions[field]

        if (!perm) return d.error(`\`${d.func}: Invalid perm '${field}' in ${inside}\``)

        else reqPerms.push(perm)
    } 

    return {
        code: code.replaceLast(`$hasPerms${inside}`, member.hasPermission(reqPerms))
    }
}