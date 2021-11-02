const { Utils, version } = require("lavacoffee");
const Searches = new (require("discord.js")).LimitedCollection({
    sweepInterval: 30000,
    sweepFilter: (require("discord.js")).LimitedCollection.filterByLifetime({ lifetime: 5000 })
});
const { randomBytes } = require("crypto");
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

function getRandomBytes(size) {
    return new Promise(resolve => {
        randomBytes(size, (_, buf) => {
            resolve(buf.toString("base64"));
        });
    });
}

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
            response = lavalink.version;
        }
            break;
        case "isPlaying": {
            response = Boolean(player?.state === Utils.PlayerStates.Playing);
        }
            break;
        case "isPaused": {
            response = Boolean(player?.state === Utils.PlayerStates.Paused)
        }
            break;
        case "isIdling": {
            response = Boolean(player?.state !== Utils.PlayerStates.Destroyed && !player.queue.current)
        }
            break;
        case "songinfo": {
            const track = player.queue.at(Number(data[1]) - 1) || player.queue.current;
            if (!track) return;

            const p = data[0];

            if (["current_duration", "duration_left"].includes(p))
                response = player.getTimestate((p === "duration_left"))

            else if (track[p]) response = track[p]
            else response = "";
        }
            break;
        case "skip": {
            if (player.state === Utils.PlayerStates.Playing) {
                player.stop(Number(data[0]));
            }
        }
            break;
        case "stop": {
            player.queue.clear();
            player.setLoop(Utils.LoopMode.None);
            player.stop();
        }
            break;
        case "pause": {
            player.pause(true);
        }
            break;
        case "resume": {
            player.pause(false);
        }
            break;
        case "seek": {
            player.seek(Number(data[0]) * 1000);
        }
            break;
        case "state": {
            response = player.state;
        }
            break;
        case "destroy": {
            player.destroy();
        }
            break;
        case "search": {
            const tracks = await lavalink.search({query: data[0], source: data[1] || "yt"}, message.author.id);
            const id = getRandomBytes(10);
            Searches.set(id, tracks);
            response = id;
        };
            break;
        case "getsearch": {
            const tracks
        }
        case "addtrack": {
            const tracks = Searches.get(data[0]);
            if (!tracks) return d.error("Lavalink error: No search with encoded")
            const n1 = Number(data[1]);
            const n2 = Number(data[2]);
            let sel_tracks = tracks[n1 - 1];
            if (n2) sel_tracks = tracks.slice(n1 - 1, n2 - 1);
            
            player.queue.add(sel_tracks);
            response = sel_tracks.length;
        }
        case "play": {
            player.play();
        }
            break;
        case "patchFilters": {
            player.patchFilters();
        }
            break;
        case "resetFilters": {
            player.filters = {};
            player.setFilters({ volume: 1.0 });
            player.patchFilters();
        }
            break;
        case "addFilters": {
            const constructFilter = { ...player.filters };

            for (const input of data) {
                let [key, value = ""] = input.split("=");
                value = JSON.stringify(`'${value}'`);
                constructFilter[key] = value;
            };

            player.setFilters(constructFilter);
        }
            break;
        case "volume": {
            player.filters.volume = Number(data[0]) / 100;
        }
            break;
        case "queueLength": {
            response = player.queue.size;
        }
            break;
        case "queue": {
            const mapFormat = data.join(";").addBrackets();
            const array = [];
            let i;
            for (i = 0; i < player.queue.size; i++) {
                const track = player.queue.at(i);
                const clone = { ...track, userID: track.requesterId, linenumber: i + 1 };
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
        case "loopmode": {
            const r = Utils.LoopMode[data[0].slice(0,1).toUpperCase() + data[0].slice(1)];
            if (!r) return d.error("LavaCommands ERR: Unknown mode `" + data[0] + "`");
            player.setLoop(r);
            response = r;
        };
            break;
        case "loopqueue": {
            console.log("LavaCommands DEPRECATE: This method (loopqueue) is deprecated, use method (loopmode) instead");
            const r = player.loop === Utils.LoopMode.Queue ? Utils.LoopMode.None : Utils.LoopMode.Queue
            player.setLoop(r);
            response = r;
        };
            break;
        case "loopsong": {
            console.log("LavaCommands DEPRECATE: This method (loopsong) is deprecated, use method (loopmode) instead");
            const r = player.loop === Utils.LoopMode.Track ? Utils.LoopMode.None : Utils.LoopMode.Track
            player.setLoop(r);
            response = r;
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
