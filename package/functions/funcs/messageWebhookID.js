module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$messageWebhookID`, d.message.webhookID || "")
    }
}