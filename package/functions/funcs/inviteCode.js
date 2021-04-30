module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteCode`, d.data.invite ? d.data.invite.code : "")
    }
}