const embed = require("../../handlers/errors")
module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    if (!d.message.channel.nsfw) return embed(d, inside.inside)

    return {
        code: code.replaceLast(`$onlyNSFW${inside}`, "")
    }
}