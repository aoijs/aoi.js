module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [
        number,
        text
    ] = inside.splits

    const n = Number(number)

    if (isNaN(n)) return d.error(`:x: Invalid number in \`$repeatMessage${inside}\``)

    return{
        code: code.replaceLast(`$repeatMessage${inside}`, text.repeat(n))
    }
}