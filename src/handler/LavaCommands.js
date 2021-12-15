const {Utils} = require("leref.ts");
const Searches = new (require("discord.js").LimitedCollection)({
    sweepInterval: 5000,
    sweepFilter: require("discord.js").LimitedCollection.filterByLifetime({
        lifetime: 5000,
    }),
});
const {randomBytes} = require("crypto");

function getRandomBytes(size) {
    return new Promise((resolve) => {
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
    return d.aoiError.fnError(d, "custom", data, message);
}

async function Main(d) {
    /** @type {import("discord.js").Message} */
    const message = d.message;
    /** @type {import("discord.js").Client} */
    const client = d.client;

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
    if (method !== "connect" && !player)
        return await error(d, da, "Lavalink ERR! PLAYER_UNAVAILABLE in");

    try {
        switch (method) {
            case "connect": {
                const voice = message.member.voice;
                if (!voice)
                    return await error(d, da, "Lavalink ERR! MEMBER_NO_VOICE in");

                const [deaf, mute] = data;
                player = lavalink.lavalink.create({
                    guildID: message.guildId,
                    selfDeaf: deaf,
                    selfMute: mute,
                });
                const old = player.options.voiceID;
                player.options.voiceID = voice.channelId;
                if (old !== player.options.voiceID) {
                    player.connect();
                }
            }
                break;
            case "disconnect": {
                player.disconnect();
                player.destroy();
                player.queue.clear();
            }
                break;
            case "version": {
                response = lavalink.version;
            }
                break;
            case "isplaying": {
                response = Boolean(player?.state === Utils.PlayerStates.Playing);
            }
                break;
            case "ispaused": {
                response = Boolean(
                    player?.state === Utils.PlayerStates.Paused && player.queue.current,
                );
            }
                break;
            case "isidling": {
                response = Boolean(
                    player?.state === Utils.PlayerStates.Paused &&
                    !player.queue.current,
                );
            }
                break;
            case "songinfo": {
                let abc;
                let track =
                    player.queue.at(Number(data[1]) - 1) || player.queue.current;
                if (!data[1] || (Number(data[1]) - 1 < 0))
                    for (abc = 0; abc < player.queue.size; abc++) {
                        track = player.queue.at(abc)
                    }
                if (track) {
                    const p = data[0];
                    if (p === "current_duration") {
                        const d = lavalink.getCurrent(player);
                        response = `${d.minute}:${d.second}`;
                        if (d.hour > 0) {
                            response = `${String(d.hour)}:${response}`;
                        }
                    } else if (p === "duration_left") {
                        const d = lavalink.getLeft(player, track);
                        response = `${d.minute}:${d.second}`;
                        if (d.hour > 0) {
                            response = `${String(d.hour)}:${response}`;
                        }
                    } else if (track[p]) response = track[p];
                    else response = "";
                }
            }
                break;
            case "skip": {
                if (
                    player.state !== Utils.PlayerStates.Destroyed &&
                    player.queue.current
                ) {
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
            case "clearqueue": {
                player.queue.clear();
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
                const n = Number(data[0]) * 1000 ?? 0;
                player.position = n;
                player.lastUpdated = Date.now();
                player.seek(n);
            }
                break;
            case "state": {
                response = Utils.PlayerStates[player.state];
            }
                break;
            case "getthumbnail": {
                response = `https://img.youtube.com/vi/${String(data[0])}/${
                    data[1] || "default"
                }.jpg`;
            }
                break;
            case "search": {
                const res = await lavalink.lavalink.search(
                    {query: data[0], source: data[1] || "yt"},
                    message.member,
                );
                const id = (await getRandomBytes(10)).toString("hex");
                Searches.set(
                    id,
                    res.tracks.slice(0, 10).map((v) => {
                        const d = lavalink.getTime(v.duration / 1000);
                        v.length = v.duration;
                        v.duration = `${d.minute}:${d.second}`;
                        if (d.hour > 0) {
                            v.duration = `${String(d.hour)}:${v.duration}`;
                        }
                        v.thumbnail = v.displayThumbnail("default");
                        return v;
                    }),
                );
                response = id;
            }
                break;
            case "getsearch": {
                const tracks = Searches.get(data[0]);
                if (tracks)
                    response = tracks.map((v) => v.title.addBrackets()).join(",");
                else response = "";
            }
                break;
            case "tracksplit": {
                const tracks = Searches.get(data[0]);
                if (tracks) {
                    response = "true";
                    array = tracks.map((v) => v.title);
                }
                response = "false";
            }
                break;
            case "findentry": {
                const tracks = Searches.get(data[0]);
                if (!tracks)
                    return await error(d, da, "Lavalink ERR! INVALID_KEYSEARCH in");
                const query = data.slice(1).join(";");
                const index = tracks.findIndex((v) =>
                    v.title.toLowerCase().includes(query.toLowerCase()),
                );

                response = index + 1;
            }
                break;
            case "addtrack": {
                const tracks = Searches.get(data[0]);
                if (!tracks)
                    return await error(d, da, "Lavalink ERR! INVALID_KEYSEARCH in");

                const n1 = Number(data[1]);
                const n2 = Number(data[2] || "e");
                let sel_tracks = tracks[n1 - 1];
                if (!isNaN(n2)) sel_tracks = tracks.slice(n1 - 1, n2 - 1);
                if (!sel_tracks)
                    return await error(d, da, "Lavalink ERR! NO_MATCHES");

                player.queue.add(sel_tracks);
                response = Array.isArray(sel_tracks) ? sel_tracks.length : 1;
            }
                break;
            case "play": {
                player.play({});
            }
                break;
            case "resetfilters": {
                player.filters = {};
                player.setFilters({volume: 1.0});
                player.patchFilters();
            }
                break;
            case "addfilters": {
                const constructFilter = {...player.filters};

                for (const input of data) {
                    let [key, value = ""] = input.split("=");
                    try {
                        value = JSON.parse(value);
                    } catch {
                    }
                    constructFilter[key] = value;
                }

                player.setFilters(constructFilter);
                player.patchFilters();
            }
                break;
            case "destroy": {
                console.warn(
                    "Lavalink WARN! method(loopsong) deprecated, use method(loopmode) in",
                );
                player.destroy();
            }
                break;
            case "volume": {
                if (!data[0]) response = player.options.volume;
                else player.setVolume(Number(data[0]));
            }
                break;
            case "queuetotal": {
                response = player.queue.totalSize;
            }
                break;
            case "shuffle": {
                response = player.queue.shuffle();
            }
                break;
            case "queueduration": {
                response = player.queue.duration;
            }
                break;
            case "queue": {
                const mapFormat =
                    data.join(";").addBrackets() ||
                    "{entrynumber}. [{title}]({url}) by {userTag}";
                const array = [];
                let i;
                for (i = 0; i < player.queue.size; i++) {
                    const track = player.queue.at(i);
                    const clone = {
                        ...track,
                        userID: track.requester.id,
                        userTag: track.requester.user.tag,
                        entrynumber: i + 1,
                    };
                    const res = mapFormat.replace(/{\w+}/g, (match) => {
                        const r = clone[match.replace(/[{}]/g, "")];
                        if (r) return r;
                        return "";
                    });
                    array.push(res);
                }
                response = array.join("\n");
            }
                break;
            case "loopmode": {
                const mode = data[0];
                if (!mode) {
                    response = Utils.LoopMode[String(player.loop)];
                } else {
                    const r =
                        Utils.LoopMode[
                        data[0].slice(0, 1).toUpperCase() + data[0].slice(1)
                            ];
                    if (!r)
                        return await error(d, da, "Lavalink ERR! LOOPMODE_UNKNOWN in");
                    player.setLoop(r);
                    response = r;
                }
            }
                break;
            case "loopqueue": {
                console.warn(
                    "Lavalink WARN! method(loopqueue) deprecated, use method(loopmode) in",
                );
                const r =
                    player.loop === Utils.LoopMode.Queue
                        ? Utils.LoopMode.None
                        : Utils.LoopMode.Queue;
                player.setLoop(r);
                response = r;
            }
                break;
            case "loopsong": {
                console.warn(
                    "Lavalink WARN! method(loopsong) deprecated, use method(loopmode) in",
                );
                const r =
                    player.loop === Utils.LoopMode.Track
                        ? Utils.LoopMode.None
                        : Utils.LoopMode.Track;
                player.setLoop(r);
                response = r;
            }
                break;
            default: {
                return await error(d, da, "Lavalink ERR! METHOD_UNAVAILABLE in");
            }
        }
    } catch (err) {
        return await error(d, da, `Lavalink INTERNAL_ERR! ${err.message}`);
    }

    da.result = String(response ?? "");
    d.array = array;
    d.data.array = d.array;

    return {
        code: d.util.setCode(da),
        array: d.array,
        data: d.data,
    };
}

module.exports = Main;
