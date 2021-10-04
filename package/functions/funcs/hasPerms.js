const permissions = require("../../utils/permissions.js")

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits
    const userID = fields.shift()

    const member = await d.message.guild.members.fetch(userID).catch(err => {})

    if (!member) return d.error(`:x: Invalid user ID in \`$hasPerms${inside}\``)

    const reqPerms = []

    for (const field of fields) {
        const perm = permissions[field]

        if (!perm) return d.error(`:x: Invalid perm '${field}' in \`$hasPerms${inside}\``)

        else reqPerms.push(perm)
    } 

    return {
        code: code.replaceLast(`$hasPerms${inside}`, member.hasPermission(reqPerms))
    }
}