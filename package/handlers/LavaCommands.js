const VALID_METHODS = [
  "volume",
  "filters",
  "stop",
  "resume",
  "pause",
  "play",
  "seek",
  "skip",
  "loopqueue",
  "looptrack",
  "songinfo",
  "state",
  "queue",
  "isPlaying",
  "join",
  "leave",
  "connect",
  "disconnect",
  "prune",
  "destroy",
  "queueLength",
];
const SUCCESS_RESULT = ["PLAYLIST_LOADED", "TRACK_LOADED", "SEARCH_RESULT"];
const SEARCH_METHODS = ["ytsearch", "scsearch"];
const leaveBody = {
  op: 4,
  d: {
    channel_id: null,
    guild_id: undefined,
    self_mute: false,
    self_deaf: false,
  },
};
const songOptions = require("../utils/songOptions");

module.exports = async (d) => {
  if (!d.client.lavalink)
    return d.error(
      `❌ Lavalink connection is required in \`$lavalinkExecute${inside.total}\`!`
    );
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  let response = "";

  if (err) return d.error(err);
  const [method, ...data] = inside.splits;

  if (!VALID_METHODS.includes(method))
    return d.error(
      `❌ Invalid method was provided in \`$lavalinkExecute${inside.total}\`!`
    );

  const Player = d.client.lavalink.get(d.message.guild.id);
  if (!Player.text) Player.setTextChannel(d.message.channel);

  switch (method) {
    case "volume":
      {
        const volume = new Number(data[0]);

        if (isNaN(volume))
          return d.error(
            `❌ Argument is not a number in \`$lavalinkExecute${inside.total}\`!`
          );
        Player.setVolume(volume);
      }
      break;
    case "filters":
      {
        try {
          const json = JSON.parse(data[0]);

          try {
            Player.mgr.ws.send({
              op: "filters",
              guildId: d.message.guild.id,
              ...json,
            });
          } catch (e) {
            return d.error(
              `❌ Unexpected error when trying to send Packet in \`$lavalinkExecute${inside.total}\`!`
            );
          }
        } catch (n) {
          return d.error(
            `❌ Failed to parse JSON in \`$lavalinkExecute${inside.total}\`!`
          );
        }
      }
      break;
    case "stop":
      {
        Player.stop();
      }
      break;
    case "seek":
      {
        const ms = new Number(data[0]);

        if (isNaN(ms))
          return d.error(
            `❌ Argument is not a number in \`$lavalinkExecute${inside.total}\`!`
          );
        Player.seek(ms);
      }
      break;
    case "pause":
      {
        Player.pause();
      }
      break;
    case "resume":
      {
        Player.resume();
      }
      break;
    case "loopqueue":
      {
        const bool = !Player.loopQueue;
        Player.setQueueLoop(bool);
        response = new String(bool);
      }
      break;
    case "looptrack":
      {
        const bool = !Player.loopTrack;
        Player.setTrackLoop(bool);
        response = new String(bool);
      }
      break;
    case "state":
      {
        response = new String(Player.state);
      }
      break;
    case "skip":
      {
        const check = new Number(data[0]) || 0;

        if (!isNaN(check))
          Player.queue = Player.queue.splice(
            check < 1 ? 0 : check - 1,
            Player.queue.length
          );
        Player.skip();
      }
      break;
    case "queue":
      {
        let [
          page = "1",
          max = "10",
          format = "{number}) {title} by {username}",
          current = "no",
        ] = data;

        const queue = Player.queue;
        page = new Number(page);
        max = new Number(max);
        let y = max * page - max;

        if (isNaN(page) || isNaN(max))
          return d.error(
            `❌ Expected number in \`$lavalinkExecute${inside.total}\`!`
          );
        if (current.toLowerCase() === "no" && y < 1) y = 1;

        const songs = [];

        for (const song of queue.slice(y, max * page)) {
          const user = d.client.users.cache.get(song.userID);
          songs.push(
            format
              .replace(/{number}/g, y)
              .replace(/{userID}/g, user ? user.id : song.userID)
              .replace(/{title}/g, song.title.removeBrackets())
              .replace(/{url}/g, song.url)
              .replace(/{description}/g, song.description || "")
              .replace(/{duration}/g, song.duration)
              .replace(/{publisher}/g, song.publisher || "")
              .replace(/{publisher_url}/g, song.publisher_url || "")
              .replace(/{username}/g, user ? user.username : "")
              .replace(/{discriminator}/g, user ? user.discriminator : "")
              .replace(/{usertag}/g, user ? user.tag : "")
          );
          y++;
        }

        response = songs.join("\n");
      }
      break;
    case "songinfo":
      {
        if (!songOptions[data[0]])
          return d.error(
            `❌ Song Option does not exist, received \`${data[0]}\` in \`$lavalinkExecute${inside.total}\`!`
          );

        if (!Player.queue[0])
          return d.error(
            `❌ Nothing was playing in \`$lavalinkExecute${inside.total}\`!`
          );

        const songInfo = {
          ...Player.queue[0],
          current_duration: (player) => {
            return d.client.lavalink._resolveDuration(Player.timeState);
          },
          duration_left: (player) => {
            return d.client.lavalink._resolveDuration(
              Player.queue[0].raw.info.length - Player.timeState
            );
          },
        };
        response =
          typeof songInfo[data[0]] == "function"
            ? songInfo[data[0]](Player)
            : songInfo[data[0]];
      }
      break;
    case "destroy":
      {
        Player.stop();
        Player.mgr.ws.send({
          op: "destroy",
          guildId: d.message.guild.id,
        });
        d.client.lavalink.servers.delete(d.message.guild.id);
      }
      break;
    case "isPlaying":
      {
        if (Player.state === "PLAYING") {
          response = "true";
        } else {
          response = "false";
        }
      }
      break;
    case "play":
      {
        const check = d.message.member.voice.channel;
        const queryMethod = data[0].split(":")[0];

        if (check === null)
          return d.error(
            `❌ Expected Voice Channel, instead received \`null\` in \`$lavalinkExecute${inside.total}\`!`
          );

        if (!SEARCH_METHODS.includes(queryMethod))
          return d.error(
            `❌ Expected \`ytsearch\` or \`scsearch\` as search method, instead received \`${queryMethod}\` in \`$lavalinkExecute${inside.total}\`!`
          );

        if (!Player.voiceChannel) await Player.join(check);
        const res = await d.client.lavalink.search(data[0]);

        if (!SUCCESS_RESULT.includes(res.loadType)) {
          if (res.loadType === "NO_MATCHES")
            return d.error(
              `❌ No matches with query \`${data[0]}\` in \`$lavalinkExecute${inside.total}\`!`
            );

          return d.error(
            `❌ Unexpected response \`LOAD_FAILED\` from Host in \`$lavalinkExecute${inside.total}\`!`
          );
        } else {
          if (res.loadType === "PLAYLIST_LOADED") {
            for (const t of res.tracks) {
              t.userID = d.message.author.id;
              Player.add(t);
            }
            response = res.tracks.length;
          } else {
            res.tracks[0].userID = d.message.author.id;
            Player.add(res.tracks[0]);
            response = res.tracks[0].title;
          }

          Player.play();
        }
      }

      break;
    case "join":
      {
        if (d.message.member.voice.channel === null)
          return d.error(
            `❌ Expected Voice Channel, instead received \`null\` in \`$lavalinkExecute${inside.total}\`!`
          );

        Player.join(d.message.member.voice.channel);
      }
      break;
    case "connect":
      {
        if (d.message.member.voice.channel === null)
          return d.error(
            `❌ Expected Voice Channel, instead received \`null\` in \`$lavalinkExecute${inside.total}\`!`
          );

        Player.join(d.message.member.voice.channel);
      }
      break;
    case "leave":
      {
        Player.stop();
        Player.mgr.ws.send({
          op: "destroy",
          guildId: d.message.guild.id,
        });
        Player.sendCallback(d.message.guild.id, leaveBody);
        d.client.lavalink.servers.delete(d.message.guild.id);
      }
      break;
    case "disconnect":
      {
        Player.stop();
        Player.mgr.ws.send({
          op: "destroy",
          guildId: d.message.guild.id,
        });
        Player.sendCallback(d.message.guild.id, leaveBody);
        d.client.lavalink.servers.delete(d.message.guild.id);
      }
      break;
    case "prune":
      {
        const bool = !Player.prune;
        Player.setPrune(bool);
        response = new String(bool);
      }
      break;
    case "queueLength": {
      response = new String(Player.queue.length);
    }
  }

  return {
    code: code.replaceLast(`$lavalinkExecute${inside}`, response || ""),
  };
};
