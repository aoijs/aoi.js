module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
    
    console.log(inside.addBrackets())
    
    return {
        code: code.replaceLast(`$log${inside}`, "")
    }
}