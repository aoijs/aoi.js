module.exports = async d => {
    const code =d.command.code 
    
    const r = code.split("$stringStartsWith").length - 1 
    
    const inside = code.split("$stringStartsWith" )[r].after()
    
    if (!inside.inside) return d.error(`❌ Invalid usage in \`$stringStartsWith\``)
    
    return {
        code: code.replaceLast(`$stringStartsWith${inside.total}`, inside.splits[0].addBrackets().startsWith(inside.splits.slice(1).join(";").addBrackets())) 
    }
}