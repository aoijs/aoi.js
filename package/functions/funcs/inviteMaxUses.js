module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteMaxUses`, d.data.invite ? d.data.invite.maxUses : "")
    }
}