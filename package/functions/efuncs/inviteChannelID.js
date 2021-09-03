module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteChannelID`, d.data.invite ? d.data.invite.channel.id : "")
    }
}