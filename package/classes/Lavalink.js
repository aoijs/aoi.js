const LavaCoffee = require("lavacoffee");
const { EventEmitter } = require("events");

class Lavalink extends EventEmitter {
    constructor(client) {
        super();
        /**
         * @type {import("discord.js").Client}
         */
        this.client = client;
        const lavalink = new LavaCoffee.CoffeeLava({});
        lavalink.on("nodeConnect", (node) => this.debug(`Node ${node.options.url} connected`));
        lavalink.on("nodeDisconnect", (node) => this.debug(`Node ${node.options.url} disconnected`));
        lavalink.on("playerCreate", (p) => this.debug(`Player created for GUILD(${p.options.guildID})`));
        lavalink.on("playerDestroy", (p) => this.debug(`Player destroyed for GUILD(${p.options.guildID})`));
        // lavalink.on("playerReplay", (p) => {
        //     this.debug(`Player replayed for GUILD(${p.options.guildID})`);
        //     this.emit("trackReplayed", p, p.queue.current);
        // });
        lavalink.on("trackStart", (p, track) => {
            this.debug(`Player starting track for GUILD(${p.options.guildID})`);
            this.client.emit("musicStart", track, {channel: {guild: this.client.guilds.cache.get(p.options.guildID)}, textChannel: p.text});
        });
        lavalink.on("trackEnd", (p, track) => {
            this.debug(`Player ended track for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", track, {channel: {guild: this.client.guilds.cache.get(p.options.guildID)}, textChannel: p.text});
        });
        lavalink.on("trackStuck", (p, track) => {
            this.debug(`Player sent STUCK for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", track, {channel: {guild: this.client.guilds.cache.get(p.options.guildID)}, textChannel: p.text});
        });
        lavalink.on("trackError", (p, track) => {
            this.debug(`Player sent EXCEPTION for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", track, {channel: {guild: this.client.guilds.cache.get(p.options.guildID)}, textChannel: p.text});
        });
        /** @type {import("lavacoffee").CoffeeLava} */
        this.lavalink = lavalink;
        this.client.lavalink = this;
        this.client.on("raw", (d) => this.lavalink.updateVoiceData(d));
        this.client.once("ready", () => this.lavalink.init(this.client.user.id));
        this.lavalink.send = (guildId, d) {
          const guild = this.client.guilds.cache.get(guildId);
          if (guild) guild.shard.send(d);
       }
    };
    
    get version() {
        return LavaCoffee.version
    }
    /**
     * Creates a connection to Lavalink, refers as node
     * @param {import("lavacoffee/dist/utils/typings").NodeOptions} options
     */
    addNode(options) {
        return this.lavalink.add(options);
    }

    debug(message) {
        this.emit("debug", `[\u001b[36;1mLavaCoffee\u001b[0m]:`, String(message));
    }
}

module.exports = Lavalink;
