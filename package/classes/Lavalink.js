const Lava = require("../Lavalink/index.js");
const {Collection} = require('discord.js');
const {EventEmitter} = require('events')
class Lavalink extends EventEmitter {
    constructor(client){
        super();
        this.client = client 
        this.lavalink = new Collection()
        this.client.lavalink = this 
    }
    createLavalinkConnection(url, password, debug = false) {
    const clLength = this.lavalink.size;
    this.client.once("ready", () => {
      const connection = new Lava.LavalinkConnection(url, password, this.client.user.id);
      this.lavalink.set(clLength, connection);
      this.client.on("raw", connection.trackVoiceStateUpdates());

      if (debug === true)
        connection.on("debug", (message) => console.log(message)); 
      // Music things
      connection.on("trackFinished", (player) => {
        this.client.emit("musicStart", player, null);
      });
        connection.on("trackPlaying", (player) => {
        this.client.emit("musicEnd", player, null);
      });
})
    }
}
module.exports = Lavalink;