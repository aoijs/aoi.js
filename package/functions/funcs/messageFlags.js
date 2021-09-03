module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$messageFlags`, d.message.flags.toArray().goof())
    }
} 