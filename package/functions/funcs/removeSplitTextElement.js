module.exports = async d => {
    const code = d.command.code 
    
	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const elements = inside.splits
    
    return {
        array: d.array.filter((x, y) => !elements.includes(String(y + 1))), 
        code: code.replaceLast(`$removeSplitTextElement${inside}`, "")
    }
} 