module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$messageAttachment`, d.message.attachments.size ? d.message.attachments.first().url : "")
    }
}