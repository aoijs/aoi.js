const queue = require("../../functions/funcs/queue")

module.exports = async d => {
    const server = d.client.servers.get(d.message.guild.id)

    if(!server) return d.error(`:x: Nothing is being played!`)

  let songs = queue.songs;
    for (let i = server.songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [server.songs[i], server.songs[j]] = [server.songs[j], server.songs[i]];
    }
    
    d.client.servers.set(d.message.guild.id, server)
    
    return {
        code: d.command.code.replaceLast(`$shuffleQueue`, "")
    }
}