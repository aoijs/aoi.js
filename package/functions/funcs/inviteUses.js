module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteUses`, d.data.invite ? d.data.invite.uses : "")
    }
}