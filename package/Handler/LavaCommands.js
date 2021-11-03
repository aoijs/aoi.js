const { Utils } = require("lavacoffee");
const Searches = new (require("discord.js")).LimitedCollection({
    sweepInterval: 5000,
    sweepFilter: (require("discord.js")).LimitedCollection.filterByLifetime({ lifetime: 5000 })
});
const { randomBytes } = require("crypto");

function getRandomBytes(size) {
    return new Promise(resolve => {
        randomBytes(size, (_, buf) => {
            resolve(buf);
        });
    });
}

// async function error(d, data, message) {
//     const m = await d.util.errorParser(message, d);
//     d.aoiError.makeMessageError(d.client, d.channel, m, {},d)
//     return {
//         code: d.util.setCode(data),
//         error: true
//     };
// }

async function error(d, data, message) {
    return d.aoiError.fnError(d, 'custom', data, message)
}

async function Main(d) {
    /** @type {import("discord.js").Message} */
    const message = d.message;
    /** @type {import("discord.js").Client} */
    const client = d.client;

    // hi its me, kino, wassup
    /** @type {import("../classes/Lavalink")} */
    const lavalink = client.lavalink;

    const da = d.util.openFunc(d);
    const inside = da.inside;
    const code = da.code;

    if (da.err) return await error(d, da, da.err);
    if (!message.guild) return await error(d, da, "Lavalink ERR! GUILD_MISSING");

    let response = "";
    let [method, ...data] = inside.splits;
    let player = lavalink.lavalink.get(message.guild.id);
    method = method.toLowerCase();
    let array = d.array;
    if (method !== "connect" && !player) return await error(d, da, "Lavalink ERR! PLAYER_UNAVAILABLE in");

    switch (method) {
        case "connect": {
            const voice = message.member.voice;
            if (!voice) return await error(d, da, "Lavalink ERR! MEMBER_NO_VOICE in");

            const [deaf, mute] = data
            player = lavalink.lavalink.create({
                guildID: message.guildId,
                selfDeaf: deaf,
                selfMute: mute
            });
            player.options.voiceID = voice.channelId;
            player.connect();
        }
            break;
        case "disconnect": {
            player.disconnect();
            player.destroy();
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

            if (p === "current_duration") {
                const d = lavalink.getTime(Date.now() - (player.lastUpdated + player.position));
                response = `${d.minute}:${d.second}`;
                if (d.hour > 0) {
                    response = `${String(d.hour)}:${response}`;
                }
            } else if (p === "duration_left") {
                const d = lavalink.getTime(player.lastUpdated + track.duration - Date.now());
                response = `${d.minute}:${d.second}`;
                if (d.hour > 0) {
                    response = `${String(d.hour)}:${response}`;
                }
            }
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
        case "getthumbnail": {
            const id = data[0];
            return "https://img.youtube.com/vi/" + id + "/" + data[1] + ".jpg";
        }
        case "search": {
            const res = await lavalink.lavalink.search({query: data[0], source: data[1] || "yt"}, message.author.id);
            const id = (await getRandomBytes(10)).toString("hex");
            Searches.set(id, res.tracks.slice(0, 10).map(v => {
                const d = lavalink.getTime(v.duration);
                v.duration = `${d.minute}:${d.second}`;
                if (d.hour > 0) {
                    v.duration = `${String(d.hour)}:${v.duration}`
                };
                v.thumbnail = v.displayThumbnail("default");
                return v;
            }));
            response = id;
        };
            break;
        case "getsearch": {
            const tracks = Searches.get(data[0]);
            if (tracks) response = tracks.map(v => v.title.addBrackets()).join(",")
            else response = "";
        }
            break;
        case "tracksplit": {
            const tracks = Searches.get(data[0]);
            if (tracks) {
                response = "true";
                array = tracks.map(v => v.title);
            }; response = "false";
        }
        case "findentry": {
            const tracks = Searches.get(data[0]);
            if (!tracks) return await error(d, da, "Lavalink ERR! INVALID_KEYSEARCH in");
            const query = data.slice(1).join(";")
            const index = tracks.findIndex(v => v.title.toLowerCase().includes(query.toLowerCase()));

            response = index + 1;
        }
            break;
        case "addtrack": {
            const tracks = Searches.get(data[0]);
            if (!tracks) return await error(d, da, "Lavalink ERR! INVALID_KEYSEARCH in");

            const n1 = Number(data[1]);
            const n2 = Number(data[2] || "e");
            let sel_tracks = tracks[n1 - 1];
            if (!isNaN(n2)) sel_tracks = tracks.slice(n1 - 1, n2 - 1);
            if (!sel_tracks) return await error(d, da, "Lavalink ERR! NO_MATCHES");

            player.queue.add(sel_tracks);
            response = Array.isArray(sel_tracks) ? sel_tracks.length : 1;
        }
            break;
        case "play": {
            player.play({});
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
        case "destroy": {
            console.warn("Lavalink WARN! method(loopsong) deprecated, use method(loopmode) in");
            player.destroy();
        }
            break;
        case "volume": {
            player.setVolume(Number(data[0]))
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
            if (!r) return await error(d, da, "Lavalink ERR! LOOPMODE_UNKNOWN in");
            player.setLoop(r);
            response = r;
        };
            break;
        case "loopqueue": {
            console.warn("Lavalink WARN! method(loopqueue) deprecated, use method(loopmode) in");
            const r = player.loop === Utils.LoopMode.Queue ? Utils.LoopMode.None : Utils.LoopMode.Queue
            player.setLoop(r);
            response = r;
        };
            break;
        case "loopsong": {
            console.warn("Lavalink WARN! method(loopsong) deprecated, use method(loopmode) in");
            const r = player.loop === Utils.LoopMode.Track ? Utils.LoopMode.None : Utils.LoopMode.Track
            player.setLoop(r);
            response = r;
        }
            break;
        default: {
            return await error(d, da, "Lavalink ERR! METHOD_UNAVAILABLE in")
        }
    }

    if (player) {
        player.text = d.channel
    }
    da.result = String(response || "");
    d.array = array;
    d.data.array = d.array;

    return {
        code: d.util.setCode(da),
        array: d.array,
        data: d.data
    };
}

module.exports = Main;
