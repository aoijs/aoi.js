module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const n = Number(inside.splits[0])

    const to = Number(inside.splits[1])

    if (!n || !to) return d.error(`\`${d.func}: Invalid number in ${inside}\``)

    return {
        code: code.replaceLast(`$roundTenth${inside}`, n.toFixed(to))
    }
}