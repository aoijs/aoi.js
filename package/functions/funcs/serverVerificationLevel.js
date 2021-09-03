module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$serverVerificationLevel`, d.message.guild.verificationLevel.split("_").map(word => word.toLowerCase().replace(word[0].toLowerCase(), word[0])).join(" "))
    }
}