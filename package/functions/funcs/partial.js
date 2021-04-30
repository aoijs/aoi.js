module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$partial`, d.message.partial)
    }
}