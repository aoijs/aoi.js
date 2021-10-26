module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [
        number,
        separator = ','
    ] = inside.splits

    if (!number || isNaN(Number(number))) return d.error(`\`${d.func}: Invalid number in ${inside}\``)

	const separated = Number(number).toLocaleString("en-US").split(",")

    return {
        code: code.replaceLast(`$numberSeparator${inside}`, separated.join(separator))
    }
}
