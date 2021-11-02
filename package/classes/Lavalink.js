const LavaCoffee = require("lavacoffee");
const { EventEmitter } = require("events");

class Lavalink extends EventEmitter {
    constructor(client) {
        super();
        /**
         * @type {import("discord.js").Client}
         */
        this.client = client;
        const lavalink = new LavaCoffee.CoffeeLava();
        lavalink.on("nodeConnect", (node) => this.debug(`Node ${node.options.url} connected`));
        lavalink.on("nodeDisconnect", (node) => this.debug(`Node ${node.options.url} disconnected`));
        lavalink.on("playerCreate", (p) => this.debug(`Player created for GUILD(${p.options.guildID})`));
        lavalink.on("playerDestroy", (p) => this.debug(`Player destroyed for GUILD(${p.options.guildID})`));
        // lavalink.on("playerReplay", (p) => {
        //     this.debug(`Player replayed for GUILD(${p.options.guildID})`);
        //     this.emit("trackReplayed", p, p.queue.current);
        // });
        lavalink.on("trackStart", (p) => {
            this.debug(`Player starting track for GUILD(${p.options.guildID})`);
            this.client.emit("musicStart", p, track);
        });
        lavalink.on("trackEnd", (p) => {
            this.debug(`Player ended track for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", p);
        });
        lavalink.on("trackStuck", (p, reason) => {
            this.debug(`Player sent STUCK for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", p, reason);
        });
        lavalink.on("trackError", (p, reason) => {
            this.debug(`Player sent EXCEPTION for GUILD(${p.options.guildID})`);
            this.client.emit("musicEnd", p, reason);
        });
        /** @type {import("lavacoffee").CoffeeLava} */
        this.lavalink = lavalink;
        this.client.lavalink = this;
    };
    
    get version() {
        return LavaCoffeee.version
    }
    /**
     * Creates a connection to Lavalink, refers as node
     * @param {import("lavacoffee/dist/utils/typings").NodeOptions} options
     */
    addNode(options) {
        return this.lavalink.add(options);
    }

    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @param {*} options 
     */
    join(guild, options = {
        channelId: null,
        selfDeaf: null,
        selfMute: null
    }) {
        const body = {
            op: 4,
            d: {
                guild_id: guild.id,
                channel_id: options.channelId,
                self_deaf: Boolean(options.selfDeaf),
                self_mute: Boolean(options.selfMute)
            }
        };

        guild.shard.send(body);
    }

    debug(message) {
        this.emit("debug", `[\u001b[36;1mLavaCoffee\u001b[0m]:`, String(message));
    }
}

module.exports = Lavalink;
