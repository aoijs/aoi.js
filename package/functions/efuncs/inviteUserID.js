module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteUserID`, d.data.invite ? d.data.invite.inviter ? d.data.invite.inviter.id : "" : "")
    }
}