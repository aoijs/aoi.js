const WebSocket = require("./Websocket");
const HTTP = require("./HTTP");
const MediaPlayer = require("./MediaPlayer");
const { EventEmitter } = require("events");
class ServerManager extends EventEmitter {
  constructor(
    options = {
      reconnectDelay: 3000,
      reconnectMaxAttempts: 5,
      shardCount: 1,
      password: "",
      userID: 1234567890,
      url: "example.com",
      send: (guildId, packet) => {},
    }
  ) {
    super();
    this.options = options;
    this.servers = new Map();
    this.ws = new WebSocket(this, this.options);
    this.api = new HTTP(this.options.url, this.options.password, this.options);
    this.sendCallback = this.options.send;
    this.timeouts = new Map();
  }

  /**
   *
   * @param {String} eventname
   * @param  {...any} args
   */

  on(eventname, ...args) {
    return this.ws.on(eventname, ...args);
  }

  /**
   *
   * @param {String} key
   * @returns {MediaPlayer}
   */
  get(key) {
    const server = this.servers.get(key);
    if (!server) {
      const newServer = new MediaPlayer(
        { ...this.options, guildId: key },
        this.sendCallback,
        this
      );
      this.servers.set(key, newServer);
      return newServer;
    }
    return server;
  }

  search(SearchQuery) {
    return this.api.load(SearchQuery).then((response) => {
      const newTracks = response.tracks.map((f) => this.resolveTracks(f));
      return { ...response, tracks: newTracks };
    });
  }

  _resolveDuration(ms) {
    const durs = {
      second: 1000 * 1,
      minute: 1000 * 1 * 60,
      hour: 1000 * 1 * 60 * 60,
    };
    const _ = ms;
    const hours = Math.trunc(ms / durs.hour) || 0;
    ms = ms - hours * durs.hour;
    const minutes = Math.trunc(ms / durs.minute) || 0;
    ms = ms - minutes * durs.minute;
    const seconds = Math.trunc(ms / durs.second) || 0;
    ms = ms - seconds * durs.second;
    let string = "";
    if (hours > 0) string = string + (hours.toString() + ":");
    if (hours > 0)
      string =
        string +
        (minutes.toString().length === 1
          ? "0" + minutes.toString() + ":"
          : minutes.toString() + ":");
    else string = string + (minutes.toString() + ":");
    string =
      string +
      (seconds.toString().length === 1
        ? "0" + seconds.toString()
        : seconds.toString());

    return " " + new String(Math.trunc(_ / 1000)) + " Seconds (" + string + ")";
  }

  resolveTracks(Track) {
    const newTrack = {
      ...Track.info,
      track: Track.track,
      duration: this._resolveDuration(Track.info.length),
      thumbnail: Track.info.uri.includes("youtube")
        ? `https://img.youtube.com/vi/${Track.info.identifier}/default.jpg`
        : null,
      raw: Track,
    };

    return newTrack;
  }

  async updateVoiceStates(packet) {
    if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t || ""))
      return;
    let server = this.servers.get(packet.d.guild_id);
    if (!server) return;

    const state = server.voiceState || {};

    if (packet.t === "VOICE_SERVER_UPDATE") {
      state.op = "voiceUpdate";
      state.guildId = packet.d.guild_id;
      state.event = packet.d;
    } else {
      if (packet.d.user_id !== this.options.userID) return;
      state.sessionId = packet.d.session_id;
      if (packet.d.channel_id && server.voiceChannel !== packet.d.channel_id)
        server.voiceChannel = packet.d.channel_id;
    }
    server.voiceState = state;
    this.servers.set(packet.d.guild_id, server);
    if (
      JSON.stringify(Object.keys(state).sort()) ===
      JSON.stringify(["event", "guildId", "op", "sessionId"])
    ) {
      this.ws.send(state);

      if (packet.d.channel_id === null)
        return this.servers.delete(packet.d.guild_id);
        
      this.servers.set(packet.d.guild_id, server);
    }
  }

  handleMessage(packet) {
    switch (packet.op) {
      case "event":
        {
          this.handleEvent(packet);
        }
        break;
      case "playerUpdate":
        {
          if (!packet.guildId) return;
        const Player = this.get(packet.guildId);
        Player.timeState = packet.state.position;
        }
        break;
      case "status":
        {
          this.lavalinkStatus = packet;
        }
        break;
    }
  }

  handleEvent(packet = {}) {
    if (!packet.guildId) return;
    const Player = this.get(packet.guildId);
    switch (packet.type) {
      case "TrackStartEvent":
        {
          this.emit(
            "trackStart",
            Player.queue.find((value) => value.track === packet.track),
            packet,
            packet.guildId,
            this
          );
          this.state = "PLAYING";
        }
        break;
      case "TrackEndEvent":
        {
          if (packet.reason === "STOPPED") {
            this.emit("trackEnd", null, packet, packet.guildId, this);
            return (this.state = "STOPPED");
          }
          const oldTrack = Player.queue.shift() || null;
          this.emit("trackEnd", oldTrack, packet, packet.guildId, this);
          Player.state = "FINISHED";
          Player.timeState = 0;
          if (Player.loopTrack === true && Player.loopQueue === false)
            Player.queue.unshift(oldTrack);
          if (Player.loopQueue === true && Player.loopTrack === false)
            Player.queue.push(oldTrack);
          if (!Player.queue.length) return;
          if (Player.queue[0] !== undefined)
            return Player.play(this.playingOptions);
        }
        break;
      case "TrackExceptionEvent":
        {
          this.emit("trackException", null, packet, packet.guildId, this);
        }
        break;
      case "TrackStuckEvent":
        {
          this.emit("trackStuck", null, packet, packet.guildId, this);
        }
        break;
    }
  }
}

module.exports = ServerManager;
