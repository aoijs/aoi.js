module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteURL`, d.data.invite ? d.data.invite.url : "")
    }
}