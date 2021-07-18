const embed = require("../../handlers/errors")
module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    const text = fields.shift()

    const error = fields.pop()

    if (!fields.every(field => text.addBrackets().includes(field.addBrackets()))) {
        return embed(d, error)
    }

    return {
        code: code.replaceLast(`$onlyIfMessageContains${inside}`, "")
    }
}