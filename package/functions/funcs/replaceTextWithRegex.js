module.exports = async d => {
    const code = d.command.code 
    
	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    let [text, reg, flags, newT] = inside.splits
    
    reg = reg.startsWith("/") && reg.endsWith("/") ? reg.slice(1, reg.length - 1) : reg
    
    if (newT === undefined) return d.error(`\`${d.func}: Invalid amount of fields in ${inside}\``)
    
    return {
        code: code.replaceLast(`$replaceTextWithRegex${inside}`, text.addBrackets().replace(new RegExp(reg.addBrackets(), flags || undefined), newT.addBrackets()).deleteBrackets())
    }
}