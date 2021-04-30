module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$serverBoostLevel`, d.message.guild.premiumTier)
    }
}