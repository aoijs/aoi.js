module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    return {
        code: d.command.code.replaceLast(`$queueLength`, server ? server.songs.length : 0)
    }
}