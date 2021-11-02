const Available_Methods = [
    "play",
    "resetFilters",
    "addFilters",
    "stop",
    "resume",
    "pause",
    "state",
    "seek",
    "skip",
    "isPlaying",
    "isPaused",
    "isIdling",
    "songinfo",
    "patchFilters",
    "version",
    "connect",
    "disconnect",
    "destroy",
    "volume",
    "queueLength",
    "queue",
    "loopqueue",
    "loopsong"
]

async function Main(d) {
    /** @type {import("discord.js").Message} */
    const message = d.message;
    /** @type {import("discord.js").Client} */
    const client = d.client;

    if (!message.guild) return d.error("`Lavalink Error: Unexpected Guild of 'null'!`");
    // hi its me, kino, wassup
    const lavalink = this.client.lavalink;
    const player = lavalink.create(message.guild?.id);

    const code = d.command.code;
    const inside = d.unpack();
    const err = d.inside(inside);

    if (err) return d.error(err);
    let response = "";
    const [method, ...data] = inside.splits;

    if (!Available_Methods.includes(method)) return d.error(`\`Lavalink Error: Method value '${method}' is not available!\``);

    switch (method) {
        case "connect": {
            const voice = message.member.voice;
            const [deaf, mute] = data
            lavalink.join(message.guild, {
                channelId: voice.channelId,
                selfDeaf: deaf,
                selfMute: mute
            });
        }
            break;
        case "disconnect": {
            const voice = message.guild.members.cache.get(client.user.id).voice;
            if (player) player.destroy();
            lavalink.join(message.guild, {});
        }
            break;
        case "version": {
            // Official Version of Wrapper
            response = LavalinkWrapperVersion;
        }
            break;
        case "isPlaying": {
            if (player) response = player.isPlaying()
            else response = "false";
        }
            break;
        case "isPaused": {
            if (player) response = player.isPaused()
            else response = "false";
        }
            break;
        case "isIdling": {
            if (player) response = player.isIdling()
            else response = "false";
        }
            break;
        case "songinfo": {
            if (!player) return d.error("`Lavalink Error: No player is available for this Guild!`");

            const track = player.queue[data[1] >= 0 && data[1] < player.queue.length ? data[1] : 0];
            if (!track) return d.error("`Lavalink Error: Nothing is playing!`");

            const p = data[0];

            if (["current_duration", "duration_left"].includes(p))
                response = player.getTimestate((p === "duration_left"))

            else if (track[p]) response = track[p];
        }
            break;
        case "skip": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            if (player.isPlaying()) {
                player.stop();
                const skipNumber = Number(data[0]);
                if (skipNumber) player.queue.splice(0, skipNumber)
                // If player state was changed to Idle after Playing,
                //  Next track will be processed,
                // does not flaw loopSong and loopQueue system
                player.state = States.IDLE;
            }
        }
            break;
        case "stop": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.stop();
        }
            break;
        case "pause": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.pause(true);
        }
            break;
        case "resume": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.pause(false);
        }
            break;
        case "seek": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.seek(Number(data[0]) * 1000);
        }
            break;
        case "state": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            response = KeyStates[player.state];
        }
            break;
        case "destroy": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.destroy();
        }
            break;
        case "play": {
            const track = await connection.search(data.join(";").addBrackets(), message.author.id);
            if (!track) return d.error("`Lavalink Error: Unexpected Search Results length of '0<X'!`");

            if (!player) {
                player = connection.createAudioPlayer(message.guild);
            }

            player.push(track);
        }
            break;
        case "patchFilters": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.patchFilters();
        }
            break;
        case "resetFilters": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.filters = { volume: 1.0 };
            player.patchFilters();
        }
            break;
        case "addFilters": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            const constructFilter = { ...player.filters };

            for (const input of data) {
                let [key, value = ""] = input.split("=");
                value = JSON.stringify(`'${value}'`);
                constructFilter[key] = value;
            };

            player.filters = constructFilter;
        }
            break;
        case "volume": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            console.warn("Lavalink Warning: Method 'volume' is deprecated and will be removed in the future, further use shouldn't be continued");

            player.manager._ws.send({
                op: "volume",
                guildId: message.guild.id,
                volume: Number(data[0])
            });
        }
            break;
        case "queueLength": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            response = player.queue.length;
        }
            break;
        case "queue": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            const mapFormat = data.join(";").addBrackets();
            const array = []
            for (const track of player.queue) {
                const clone = { ...track, userID: track.requesterId };
                const res = mapFormat.replace(/{\w+}/g, (match) => {
                    const r = clone[match.replace(/[{}]/g, "")];
                    if (r) return r;
                    return "";
                });
                array.push(res);
            }
            response = array.join("\n")
        }
            break;
        case "loopqueue": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.loopQueue = !player.loopQueue;
            response = player.loopQueue;
        };
            break;
        case "loopsong": {
            if (!player) return d.error("`Lavalink Error: No player are available for this Guild!`");
            player.loopSong = !player.loopSong;
            response = player.loopSong;
        }
            break;
    }

    if (player) {
        player.text = d.channel
    }

    return {
        code: code.replaceLast(`$lavalinkExecute${inside}`, String(response) || ""),
    };
}

module.exports = Main;
