const errorHandler = require("../../handlers/errors.js")

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const IDs = inside.splits

    const errorMessage = IDs.pop()

    if (!IDs.some(id => id === d.message.author.id)) return errorHandler(d, errorMessage)

    return {
        code: code.replaceLast(`$onlyForIDs${inside}`, "")
    }
}