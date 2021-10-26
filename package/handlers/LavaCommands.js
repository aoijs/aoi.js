/*
    Copyright (c) 2021 Andrew Trims and Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
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

const Deprecated_Methods = [
    "join",
    "leave"
];

// IDE is out of range in Package Folders
// Arrange Lavalink files (all) in one directory
// for IDE to acknowledge
const {PlayerStates: States, version: LavalinkWrapperVersion} = require("../Lavalink/Src/Util");
const KeyStates = Object.entries(States).map(v => v.reverse()).reduce((obj, v) => {obj[v[0]] = v[1]; return obj}, {});

async function Main(d)
{
    /** @type {import("discord.js").Message} */
    const message = d.message;
    /** @type {import("discord.js").Client} */
    const client = d.client;

    if (!message.guild) return d.error("`Lavalink Error: Unexpected Guild of 'null'!`");

    /** @type {import("discord.js").Collection<number, import("../Lavalink/Src/LavalinkConnection")>} */
    // Contributors can continue this to add a system like Cluster, for this PR one connection will be used
    const Collection = d.client.lavalink;
    // Using at least 1 connection available
    /** @type {import("../Lavalink/Src/LavalinkConnection")} */
    const connection = Collection.first();

    // If no connection can be found, return error;
    // No x unicode mark, as of Aoi.js new error system
    if (!connection) return d.error("`Lavalink Error: Connection Instance can't be found!`");

    const code = d.command.code;
    const inside = d.unpack();
    const err = d.inside(inside);

    if (err) return d.error(err);
    let response = "";
    const [method, ...data] = inside.splits;

    if (Deprecated_Methods.includes(method)) return d.error(`\`Lavalink Error: Method value '${method}' is deprecated and will be removed in the future, further use shouldn't be continued!\``);
    if (!Available_Methods.includes(method)) return d.error(`\`Lavalink Error: Method value '${method}' is not available!\``);
    // Position here to not invoke or add inefficient codes
    let player = connection._players.get(message.guild.id);

    switch (method) {
        case "connect": {
            const memberConnection = message.member.voice;
            const [deaf, mute] = data
            if (!memberConnection) return d.error("`Lavalink Error: Unexpected Member voice of 'null'!`");
            connection.joinVoiceChannel(message.guild, memberConnection.channel, (deaf === "yes"), (mute === "yes"));
        }
        break;
        case "disconnect": {
            const clientConnection = message.guild.members.cache.get(client.user.id).voice;

            if (!clientConnection) return d.error("`Lavalink Error: Unexpected Client voice of 'null'!`");
            
            if (player) player.destroy();

            connection.leaveVoiceChannel(message.guild);
            // Deletes cached voice state in case if Discord changed session Id and such
            connection.voiceStates.delete(message.guild.id);
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
            const constructFilter = {...player.filters};

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
                const clone = {...track, userID: track.requesterId};
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
