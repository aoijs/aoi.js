const ytdl = require("ytdl-core");
const embed = require("../../handlers/errors.js");
const execute = require("../../handlers/MusicPlayer.js");
const msp = require("ms-parser");
const pms = require("parse-ms");
const playlistPattern = /playlist\?list=(.+)/;

let timeout;

module.exports = async (d) => {
  const code = d.command.code;
  const search = d.client.ytSearch;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let [
    url,
    time = "1s",
    deafen = false,
    leaveEmpty = "no",
    error = ":x: Error while making the request.",
  ] = inside.splits;
  try {
    time = msp(time).ms;
  } catch {
    time = msp("1s").ms;
  }
  deafen = deafen === "yes";
  url = url.addBrackets();

  let videos = {
    videos: [],
  };

  const matchedList = url.match(playlistPattern);
  const listId = matchedList instanceof Object ? matchedList[1] : undefined;

  let urlID;

  try {
    urlID = ytdl.getVideoID(url);
  } catch {}

  try {
    if (typeof listId != "string") throw new Error("err");

    const playlist = await search.post({ listId: listId });

    if (!playlist.videos || !playlist.videos.length) throw new Error("err");

    const items = [];

    secondloop: for (const video of playlist.videos) {
      if (video.title === "[Deleted video]") {
        continue secondloop;
      }
      items.push(video);
    }

    if (!items.length) throw new Error("err");

    const songInfo = items.shift();
    videos.videos[0] = {
      title: songInfo.title.removeBrackets(),
      description: songInfo.description,
      duration: songInfo.duration,
      thumbnail: songInfo.thumbnail,
      author: {
        name: songInfo.author.name,
        url: songInfo.author.url,
      },
      url: "https://www.youtube.com/watch?v=" + songInfo.videoId,
      stream: "ytdl",
      prune: false,
    };

    if (items.length)
      videos.funcs = async (server) => {
        loop: for (const video of items) {
          const songInfo = video;

          if (songInfo.title === "[Deleted video]") {
            continue loop;
          }

          server.songs.push({
            title: () => songInfo.title.removeBrackets(),
            description: () => songInfo.description,
            duration: () =>
              songInfo.duration.toString().split("seconds").join("Seconds"),
            duration_left: (server) => {
              if (!server) return;
              const ms = msp(songInfo.duration.toString().split(" ")[0] + "s")
                .ms;
              const time = Math.floor(
                ms -
                  (server.connection.dispatcher.streamTime + (server.seek || 0))
              );
              const ISO = new Date(time)
                .toISOString()
                .substr(11, 11)
                .split(":");

              if (ISO[0] === "00") {
                ISO.shift();
                ISO[1] = Math.floor(parseInt(ISO[1]));

                if (ISO[1].toString().length === 1)
                  ISO[1] = "0" + ISO[1].toString();
              } else {
                ISO[2] = Math.floor(parseInt(ISO[2]));

                if (ISO[2].toString().length === 1)
                  ISO[2] = "0" + ISO[2].toString();
              }

              return `${Math.floor(time / 1000)} Seconds (${ISO.join(":")})`;
            },
            current_duration: (server) => {
              if (!server) return;

              const ms =
                server.connection.dispatcher.streamTime + (server.seek || 0);
              const time = pms(ms);

              const secs = `0${time.seconds % 60}`.substr(-2);
              const mins = `0${time.minutes % 60}`.substr(-2);
              const hours = `0${time.hours % 60}`.substr(-2);
              const iso = [hours, mins, secs];

              if (time.days) iso.unshift(time.days);

              return `${Math.floor(ms / 1000)} Seconds (${iso.join(":")})`;
            },
            thumbnail: () => songInfo.thumbnail,
            publisher: () => video.author.name,
            publisher_url: () => video.author.url,
            userID: () => d.message.author.id,
            url: () => "https://www.youtube.com/watch?v=" + songInfo.videoId,
            stream: "ytdl",
            prune: false,
          });

          if (server.state === "ENDED") {
            await execute(d, true, error);
          }
        }
      };
  } catch (err) {
    try {
      if (typeof urlID != "string") throw new Error("err");

      videos = {
        videos: [],
      };

      const songInfo = await search.post({ videoId: urlID });

      videos.videos[0] = {
        title: songInfo.title.removeBrackets(),
        description: songInfo.description,
        duration: songInfo.duration,
        thumbnail: songInfo.thumbnail,
        author: {
          name: songInfo.author.name,
          url: songInfo.author.url,
        },
        url: songInfo.url,
        stream: "ytdl",
        prune: false,
      };
    } catch {
      try {
        videos = await search.post({ search: url, category: "music" });
      } catch (err) {
        console.log(err);

        return embed(d, error);
      }
    }
  }

  const video = videos.videos[0];

  if (!video) {
    return embed(d, error);
  }

  const info = {
    title: () => video.title.removeBrackets(),
    description: () => video.description,
    duration: () => video.duration.toString().split("seconds").join("Seconds"),
    thumbnail: () => video.thumbnail,
    duration_left: (server) => {
      if (!server) return;
      const ms = msp(info.duration().split(" ")[0] + "s").ms;
      const time = Math.floor(
        ms -
          (server.connection.dispatcher.streamTime +
            (d.client.servers.get(d.message.guild.id).seek || 0))
      );
      const ISO = new Date(time).toISOString().substr(11, 11).split(":");

      if (ISO[0] === "00") {
        ISO.shift();
        ISO[1] = Math.floor(parseInt(ISO[1]));

        if (ISO[1].toString().length === 1) ISO[1] = "0" + ISO[1].toString();
      } else {
        ISO[2] = Math.floor(parseInt(ISO[2]));

        if (ISO[2].toString().length === 1) ISO[2] = "0" + ISO[2].toString();
      }

      return `${Math.floor(time / 1000)} Seconds (${ISO.join(":")})`;
    },
    current_duration: (server) => {
      if (!server) return;

      const ms = server.connection.dispatcher.streamTime + (server.seek || 0);
      const time = pms(ms);

      const secs = `0${time.seconds % 60}`.substr(-2);
      const mins = `0${time.minutes % 60}`.substr(-2);
      const hours = `0${time.hours % 60}`.substr(-2);
      const iso = [hours, mins, secs];

      if (time.days) iso.unshift(time.days);

      return `${Math.floor(ms / 1000)} Seconds (${iso.join(":")})`;
    },
    publisher: () => video.author.name,
    publisher_url: () => video.author.url,
    userID: () => d.message.author.id,
    url: () => video.url,
    stream: "ytdl",
    prune: false,
  };

  let server = d.client.servers.get(d.message.guild.id);

  if (!server) {
    const vc = d.message.member.voice.channel;

    if (!vc) return embed(d, error);
    (async () => {
      const connection = vc.join().catch((err) => {
        console.error(err);

        embed(d, error);
      });

      const constructor = {
        voice: d.message.member.voice.channel,
        connection: connection,
        songs: [],
        loopSong: false,
        loopQueue: false,
        volume: null,
        text: d.message.channel,
        playing: true,
        state: "IDLE",
        vc_legacy: time,
        deafen: deafen,
        pruneEnabled: false,
        leave: leaveEmpty === "yes",
        execute: async () => {
          await execute(d, true, error);
        },
      };

      constructor.songs.push(info);
      constructor.volume = 100;

      d.client.servers.set(d.message.guild.id, constructor);

      server = constructor;

      if (typeof videos.funcs == "function") videos.funcs(server);

      try {
        await execute(d, true, error);
      } catch (err) {
        console.error(err);

        embed(d, error);
      }
    })();
  } else {
    server.songs.push(info);
    d.client.servers.set(d.message.guild.id, server);
    if (server.state === "ENDED") {
      execute(d, true, error).catch((err) => {
        console.error(err);

        embed(d, error);
      });
    }

    if (typeof videos.funcs == "function") videos.funcs(server);
  }

  return {
    code: code.replaceLast(`$playSong${inside}`, video.title.removeBrackets()),
  };
};
