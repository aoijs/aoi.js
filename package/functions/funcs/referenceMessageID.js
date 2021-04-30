//messageReferenceID
module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$referenceMessageID`, d.message.reference ? d.message.reference.messageID : "")
    }
} 