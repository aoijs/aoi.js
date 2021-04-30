module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$messageType`, d.message.type ? d.message.type.split("_").map(word => word.toLowerCase().replace(word[0].toLowerCase(), word[0])).join(" ") : "")
    }
}