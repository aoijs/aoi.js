module.exports = async d => {
    const code =d.command.code 
    
    const r = code.split("$stringEndsWith").length - 1 
    
    const inside = code.split("$stringEndsWith" )[r].after()
    
    if (!inside.inside) return d.error(`❌ Invalid usage in \`$stringEndsWith\``)
    
    return {
        code: code.replaceLast(`$stringEndsWith${inside.total}`, inside.splits[0].addBrackets().endsWith(inside.splits.slice(1).join(";").addBrackets())) 
    }
}