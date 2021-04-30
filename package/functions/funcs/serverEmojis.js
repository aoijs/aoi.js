module.exports = async d => {
    return {
        code: d.command.code.replaceLast("$serverEmojis", d.message.guild.emojis.cache.map(e => e.toString()).join(", "))
    }
}  