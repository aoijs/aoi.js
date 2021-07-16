const keyPerms = require("../../utils/permissions")
const embed = require("../../handlers/errors.js")
module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const errorMsg = fields.pop()

    const perms = []

    for (const field of fields) {
        const perm = keyPerms[field]

        if (!perm) return d.error(`\`${d.func}: Invalid perm '${field}' in ${inside}\``)

        else perms.push(perm)
    }

    if (!d.message.guild.me.hasPermission(perms)) return embed(d, errorMsg)

    return {
        code: code.replaceLast(`$onlyBotPerms${inside}`, "")
    }
}