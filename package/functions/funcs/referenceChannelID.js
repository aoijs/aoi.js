//messageReferenceChannelID
module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$referenceChannelID`, d.message.reference ? d.message.reference.channelID : "")
    }
} 