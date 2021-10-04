const modulo = async d => {

    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(err)

	if (err) return d.error(err)

    const fields = inside.splits

    if (fields.some(n => isNaN(Number(n)))) return d.error(`:x: Invalid number in \`$modulo${inside}\``)

    const n = fields.reduce((x, y) => Number(x) % Number(y))

    return {
        code: code.replaceLast(`$modulo${inside}`, n)
    }
}

module.exports = modulo