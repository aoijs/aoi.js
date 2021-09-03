module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [
        number,
        separator = ','
    ] = inside.splits

    if (isNaN(Number(number))) return d.error(`:x: Invalid number in \`$numberSeparator${inside}\``)

	let separated = splitArray(number.split('').reverse(), 3)
	separated = separated.reverse().map(num => num.reverse().join(''))

    return {
        code: code.replaceLast(`$numberSeparator${inside}`, separated.join(separator))
    }
}

function splitArray(array, pages = 2) {
	if (!array.length) return []

	const chunks = []

	for (let i = 0; i < array.length;) {
		chunks.push(array.slice(i, i += pages))
	}

	return chunks
}