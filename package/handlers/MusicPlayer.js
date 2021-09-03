const embed = require("./errors.js");
const tube = require("./tube");
const scdl = require("soundcloud-downloader");
const ytdl = require("ytdl-core");
const axios = require("axios");

let timeout;

const execute = async (d, old, error, ffmpegArgs) => {
  const server = d.client.servers.get(d.message.guild.id);

  if (!server.error) {
    server.error = error;
  }

  async function Stream(song) {
    let streamz = "";

    if (song.stream === "ytdl") {
      streamz = await tube.youtube(
        song.url(),
        d.client.cookie,
        ffmpegArgs || server.ffmpegArgs
          ? Object.keys(server.ffmpegArgs).length
            ? server.ffmpegArgs
            : null
          : null,
        song
      );
    } else if (song.stream === "scdl") {
      const axio = axios.create({
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (dbd.js; https://www.npmjs.com/package/dbd.js)",
        },
      });
      const sdl = scdl.create({
        clientID:
          typeof song.clientId === "string"
            ? song.clientId.length
              ? song.clientId
              : null
            : null,
        axiosInstance: axio,
      });

      streamz = await tube.soundcloud(
        song.url(),
        sdl,
        ffmpegArgs || server.ffmpegArgs
          ? Object.keys(server.ffmpegArgs).length
            ? server.ffmpegArgs
            : null
          : null,
        song
      );
    } else if (song.stream === "local") {
      streamz = await tube.local(
        song.path,
        ffmpegArgs || server.ffmpegArgs
          ? Object.keys(server.ffmpegArgs).length
            ? server.ffmpegArgs
            : null
          : null
      );
    }

    return streamz;
  }

  const stream = Stream(server.songs[0]);

  const connection = await server.connection;

  if (!connection) return;

  if (server.deafen) connection.voice.setSelfDeaf(true);

  server.connection = connection;

  const dispatcher = tube
    .play(server.connection, await stream)
    .once("start", async () => {
      //Queue system start

      server.state = "PLAYING";

      if (!ffmpegArgs) {
        if (d.client.music_start_commands.size)
          d.client.emit("musicStart", server);
        else
          server.songs[0].message = await server.text
            .send(`Now playing ${server.songs[0].title()}`)
            .catch((err) => {});
      }

      clearTimeout(timeout);
    })
    .once("finish", async () => {
      const newServer = d.client.servers.get(d.message.guild.id);

      if (
        newServer
          ? newServer.ffmpegArgs
            ? Object.keys(newServer.ffmpegArgs).length
              ? !isNaN(newServer.ffmpegArgs.seek)
              : null
            : null && newServer.songs.length
          : null
      ) {
        newServer.seek = newServer.ffmpegArgs.seek * 1000 || 0;

        await execute(d, true, server.error, newServer.ffmpegArgs);

        delete newServer.ffmpegArgs.seek;
        d.client.servers.set(d.message.guild.id, newServer);

        return;
      }

      if (
        server.pruneEnabled &&
        server.songs[0] &&
        typeof (server.songs[0].message || {}).delete === "function"
      )
        server.songs[0].message.delete().catch((err) => null);

      if (server.state === "STOPPED") {
        server.songs = [];
      }

      server.state = "FINISH";

      if (!server.loopSong && server.loopQueue === false) {
        server.songs.shift();
      } else if (!server.loopSong && server.loopQueue === true) {
        if (server.songs.length > 0) {
          var songs = server.songs[0];

          server.songs.push(songs);
          server.songs.shift(); //do not touch
        }
      }

      server.seek = 0;

      function timedend() {
        timeout = setTimeout(async () => {
          await server.voice.leave();

          if (d.client.music_end_commands.size)
            d.client.emit("musicEnd", server);
          else
            server.text
              .send("Queue ended, leaving voice channel!")
              .catch((err) => {});

          return d.client.servers.delete(d.message.guild.id);
        }, server.vc_legacy);
      }
      if (!server.songs.length) {
        server.state = "ENDED";

        timedend();
      } else {
        d.client.servers.set(d.message.guild.id, server);
        await execute(d, true, server.error);
      }
    })
    .once("error", async (err) => {
      if (!err) return;

      clearTimeout(timeout);

      console.error(err.message);

      d.client.emit("musicEnd", server);
      await server.voice.leave();

      return d.client.servers.delete(d.message.guild.id);
    });

  dispatcher.setVolume(server.volume / 100);
};

module.exports = execute;
