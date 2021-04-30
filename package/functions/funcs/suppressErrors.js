module.exports = async d => {
    const code = d.command.code 
    
    const inside = code.split("$suppressErrors")[1].after() 

    return {
        code: code.replaceLast(`$suppressErrors${inside.total}`, ""),
        suppressErrors: inside.inside || "" 
    }
}