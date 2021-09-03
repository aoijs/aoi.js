const {ErrorHandler} = require("../../Handler/parsers.js")

module.exports = async d => {
    const code = d.command.code
let error;
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const IDs = inside.splits

    const errorMessage = IDs.pop()

    if (!IDs.some(id => id === d.message.author.id)){ErrorHandler(d, errorMessage)
error = true 
        }
    return {
        code: code.replaceLast(`$onlyForIDs${inside}`, ""),
        error:error 
    }
}