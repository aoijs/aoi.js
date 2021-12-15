const lerefLavalink = require("leref.ts");
const {EventEmitter} = require("events");
const emit = require("../handler/lavalink/trackEvent");

class Lavalink extends EventEmitter {
    constructor(client) {
        super();
        /**
         * @type {import("./Bot.js")}
         */
        this.client = client;
        /**
         * @type {{name: string, code: string, channel: string}[]}
         */
        this.start_commands = [];
        /** @type {{name: string, code: string, channel: string}[]} */
        this.end_commands = [];
        const lavalink = new lerefLavalink.LerefLava({
            send: (guildId, d) => {
                const guild = this.client.guilds.cache.get(guildId);
                if (guild) guild.shard.send(d);
            },
        });
        lavalink.on("nodeConnect", (node) =>
            this.debug(`Node ${node.options.url} connected`),
        );
        lavalink.on("nodeDisconnect", (node) =>
            this.debug(`Node ${node.options.url} disconnected`),
        );
        lavalink.on("playerCreate", (p) =>
            this.debug(`Player created for GUILD(${p.options.guildID})`),
        );
        lavalink.on("playerDestroy", (p) =>
            this.debug(`Player destroyed for GUILD(${p.options.guildID})`),
        );
        // lavalink.on("playerReplay", (p) => {
        //     this.debug(`Player replayed for GUILD(${p.options.guildID})`);
        //     this.emit("trackReplayed", p, p.queue.current);
        // });
        lavalink.on("trackStart", (p, track) => {
            this.debug(`Player starting track for GUILD(${p.options.guildID})`);
            this.handleEvent("start", p, track);
        });
        lavalink.on("trackEnd", (p, track, reason) => {
            this.debug(`Player ended track for GUILD(${p.options.guildID})`);
            this.handleEvent("end", p, track, reason);
        });
        lavalink.on("trackStuck", (p, track, reason) => {
            this.debug(`Player sent STUCK for GUILD(${p.options.guildID})`);
            p.queue.current = undefined;
            this.handleEvent("end", p, track, reason);
        });
        lavalink.on("trackError", (p, track, reason) => {
            this.debug(`Player sent EXCEPTION for GUILD(${p.options.guildID})`);
            p.queue.current = undefined;
            this.handleEvent("end", p, track, reason);
        });
        /** @type {import("leref.ts").lerefLavalink} */
        this.lavalink = lavalink;
        this.client.lavalink = this;
        this.client.on("raw", (d) => this.lavalink.updateVoiceData(d));
        if (this.client.readyTimestamp) this.lavalink.init(this.client.user.id);
        this.client.once("ready", () => this.lavalink.init(this.client.user.id));
    }

    _validate(command) {
        if (!command.channel) return new Error("Channel is required");
        if (!command.code) return new Error("Code is required");
    }

    /**
     *
     * @param {import("leref.ts").LerefPlayer} player
     * @param {import("leref.ts").LerefTracking} track
     */
    getLeft(player, track) {
        // const rate = player.filters.timescale?.rate ?? 1;
        // const speed = player.filters.timescale?.speed ?? 1;

        const length = track.length;
        let sub = Date.now() - player.lastUpdated;
        if (
            player.queue.current &&
            player.state === lerefLavalink.Utils.PlayerStates.Paused
        )
            sub = 0;
        const res = length - (player.position + Math.round(sub)) /* *rate */;
        return this.getTime(res /* /speed */ / 1000);
    }

    /**
     *
     * @param {import("leref.ts").LerefPlayer} player
     */
    getCurrent(player) {
        // const rate = (player.filters.timescale?.rate ?? 1);
        // const speed = player.filters.timescale?.speed ?? 1;

        let sub = Date.now() - player.lastUpdated;
        if (
            player.queue.current &&
            player.state === lerefLavalink.Utils.PlayerStates.Paused
        )
            sub = 0;
        //(player.position + (Date.now() - player.lastUpdated)) / 1000)
        const res = player.position + Math.round(sub); /* *rate */
        return this.getTime(Math.round(res /* *speed */ / 1000));
    }

    /**
     *
     * @param {{name: string, code: string, channel: string}} command
     */
    trackStartCommand(command) {
        const c = this._validate(command);
        if (c) throw c;

        this.start_commands.push(command);
    }

    /**
     *
     * @param {{name: string, code: string, channel: string}} command
     */
    trackEndCommand(command) {
        const c = this._validate(command);
        if (c) throw c;

        this.end_commands.push(command);
    }

    /**
     *
     * @param {"start" | "end"} event
     * @param {import("leref.ts").LerefPlayer} player
     * @param {import("leref.ts").LerefTracking} track
     * @param {string?} [reason]
     */
    handleEvent(event, player, track, reason) {
        if (event === "start") {
            // Hardest to implement because of v5 compatibility
            emit(this.start_commands, track, player, this);
        } else if (event === "end") {
            // hi weird system, here's a counter
            player.state = lerefLavalink.Utils.PlayerStates.Paused;
            emit(this.end_commands, track, player, this, reason);
        }
    }

    getTime(ms) {
        const h = Math.trunc(ms / 3600);
        const m = Math.trunc((ms - h * 3600) / 60);
        const s = Math.trunc(ms - (h * 3600 + m * 60));

        return {
            hour: h,
            minute: `${String(m).length < 2 ? "0" : ""}${String(m)}`,
            second: `${String(s).length < 2 ? "0" : ""}${String(s)}`,
        };
    }

    get version() {
        return lerefLavalink.version;
    }

    /**
     * Creates a connection to Lavalink, refers as node
     * @param {import("leref.ts/dist/utils/typings").NodeOptions} options
     */
    addNode(options) {
        console.log(" \x1b[33mConnected with Lavalink Node: " + options.name + "\x1b[0m")
        return this.lavalink.add(options);
    }

    debug(message) {
        this.emit("debug", `[\u001b[36;1mleref.ts\u001b[0m]:`, String(message));
    }
}

module.exports = Lavalink;
