const {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus,
} = require("@discordjs/voice");
const {CommandManager} = require("./Commands.js");
const Group = require("../cachehandler/index.js").cache;
const ServerManager = require("../handler/music/class/ServerManager.js");
const {EventEmitter} = require("events");
const {Events} = require("../utils/VoiceConstants.js");
const AoiError = require("./AoiError.js");

class Voice extends EventEmitter {
    constructor(
        client,
        yt = {},
        sc = {},
        cache = {
            enabled: false,
            tracksPerGuild: 20,
        },
    ) {
        super();
        this.functionManager = client.functionManager;
        this.client = client;
        client.voiceManager = this;
        this.voice = client.voice;
        this.servers = new Group();
        this.ytdl = yt;
        this.scdl = sc;
        this.cache = cache;
        new CommandManager(this, false, Object.values(Events));
    }

    async joinVc(channel, textChannel, debug = false) {
        const d = {
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            debug: debug,
            group: this.client.user.id,
        };

        const connection = joinVoiceChannel(d);
        connection.on("debug", console.log);
        connection.on("error", console.error);
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 30000);
            this.servers.set(
                channel.guild.id,
                new ServerManager({connection, channel, textChannel, voice: this}),
            );
        } catch (error) {
            connection.destroy();
            AoiError.consoleError("joinVoiceChannelError", error);
        }
    }

    get serversSize() {
        return this.servers.size;
    }

    musicStartCommand(d = {}) {
        this.cmd.musicStart.set(this.cmd.musicStart.size, d);
    }

    musicErrorCommand(d = {}) {
        this.cmd.musicError.set(this.cmd.musicError.size, d);
    }

    trackEndCommand(d = {}) {
        this.cmd.trackEnd.set(this.cmd.trackEnd.size, d);
    }

    queueEndCommand(d = {}) {
        this.cmd.queueEnd.set(this.cmd.queueEnd.size, d);
    }

    onMusicStart() {
        this.on(Events.TRACK_START, async (track, server) =>
            require("../handler/music/events/musicStart.js")(
                track,
                server,
                this,
                this.client,
            ),
        );
    }
}

module.exports = Voice;
