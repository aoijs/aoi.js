module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$oldMessage`, d.data.oldMessage || "")
    }
} 