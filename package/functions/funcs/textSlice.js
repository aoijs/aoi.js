module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
 const [text, x, y] = inside.splits
 
 return {
 code: code.replaceLast(`$textSlice${inside}`, y ? text.addBrackets().slice(Number(x), Number(y)).deleteBrackets() : text.addBrackets().slice(Number(x)).deleteBrackets())
 }
}