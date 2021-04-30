module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    return {
        code: code.replaceLast(`$joinSplitText${inside}`, d.array.map(txt => txt.removeBrackets()).join(inside.inside))
    }
}