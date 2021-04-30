module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$serverBoostCount`, d.message.guild.premiumSubscriptionCount)
    }
}