module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$shardID`, d.message.guild.shardID)
    }
}