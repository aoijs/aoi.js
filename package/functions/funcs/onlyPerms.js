const keyPerms = require("../../util/permissions")
const {ErrorHandler} = require("../../Handler/parsers.js")

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

        if (!perm) return d.error(`:x: Invalid perm '${field}' in \`$onlyPerms${inside}\``)

        else perms.push(perm)
    }

    if (!d.message.member.hasPermission(perms)) return ErrorHandler(d, errorMsg)

    return {
        code: code.replaceLast(`$onlyPerms${inside}`, "")
    }
}
