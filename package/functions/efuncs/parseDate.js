const ms = require("parse-ms")
const parse = require("ms-parser")

module.exports = async d => {
	const code = d.command.code

	const r = code.split("$parseDate").length - 1

	const inside = code.split("$parseDate")[r].after()

	if (new Date(Number(inside.splits[0])).toLocaleString('en-US') === "Invalid Date") return d.error(":x: Invalid Date in $parseDate" + inside.total)
	//what u doing

	return {
		code: code.replaceLast(`$parseDate${inside.total}`, inside.splits[1] !== "time" ? new Date(Number(inside.splits[0])).toLocaleString('en-US') : parse(Object.entries(ms(Number(inside.splits[0]))).map((x, y) => {
			if (x[1] && y < 4) return `${x[1]}${x[0][0]}`
			else return undefined
		}).filter(e => e).join("")).string)
	}
}