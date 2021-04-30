module.exports = async d => {
    return {
        code: d.command.code.replaceLast(`$roleCount`, d.message.guild.roles.cache.size)
    }
}