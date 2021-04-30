const sum = async d => {

    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const fields = inside.splits

    if (fields.some(n => isNaN(Number(n)))) return d.error(`:x: Invalid number in \`$sum${inside}\``)

    const n = fields.reduce((x, y) => Number(x) + Number(y))

    return {
        code: code.replaceLast(`$sum${inside}`, n)
    }
}

module.exports = sum