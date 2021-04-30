module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [text, split, separator1= ", ", separator2 = "\n", every = 3] = inside.splits
    
    const data = text.addBrackets().split(split.addBrackets()) 
    
    return {
        code: code.replaceLast(`$spliceTextJoin${inside}`, data.map(_ => data.splice(0, Number(every))).filter(e => e).map(d => d.join(separator1.addBrackets())).join(separator2.addBrackets()).deleteBrackets())
    }
}