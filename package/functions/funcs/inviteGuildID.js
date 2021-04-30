module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$inviteGuildID`, d.data.invite ? d.data.invite.guild.id : "")
    }
}