module.exports = d => {
    return {
        code: d.command.code.replaceLast(`$messageID`, d.message.id)
    }
}