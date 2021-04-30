//messageReferenceGuildID
module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$referenceGuildID`, d.message.reference ? d.message.reference.guildID : "")
    }
} 