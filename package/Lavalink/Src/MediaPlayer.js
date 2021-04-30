const LavalinkWebSocket = require("./Websocket");
const { VoiceChannel, Guild } = require("discord.js");
class MediaPlayer {
  /**
   *
   * @param {LavalinkWebSocket} ws
   */
  constructor(options, sendCallback, MGR) {
    this.options = options;
    this.queue = [];
    this.voiceState = this.options.voiceState;
    this.voiceChannel = this.options.voiceChannel;
    this.guildId = this.options.guildId;
    this.state = "ENDED";
    this.sendCallback = sendCallback;
    this.volume = 100;
    this.timeState = 0;
    this.lavalinkStatus = {};
    this.playingOptions = {};
    this.loopQueue = false;
    this.loopTrack = false;
    this.prune = false;
    this.text = null;
    this.mgr = MGR;
  }

  /**
   *
   * @param {VoiceChannel|String} channel
   */
  async join(channel) {
    this.sendCallback(this.guildId, {
      op: 4,
      d: {
        channel_id: channel
          ? channel instanceof VoiceChannel
            ? channel.id
            : channel
          : this.voiceChannel,
        guild_id: this.guildId,
        self_mute: false,
        self_deaf: false,
      },
    });
  }

  add(track) {
    this.queue.push(track);
  }

  play({ start, end } = {}) {
    if (this.mgr.ws.isManualClosed)
      throw new Error(
        "Can't execute play! Connection has been terminated Manually"
      );
    this.setVolume(this.volume);
    const first = this.queue[0];
    const trackLavalink = this.queue[0] ? this.queue[0].track : undefined;
    if (!trackLavalink) return this.stop();
    const op = {
      op: "play",
      guildId: this.guildId,
      noReplace: true,
      pause: false,
      track: this.queue[0].track,
    };
    if (!isNaN(start)) op.startTime = start;
    if (!isNaN(end)) op.endTime = end;
    return this.mgr.ws.send(op).then(() => {
      this.state = "PLAYING";
    });
  }

  skip({ start, end } = {}) {
    if (this.mgr.ws.isManualClosed)
      throw new Error(
        "Can't skip song! Connection has been terminated Manually"
      );
    this.mgr.handleEvent({
      type: "TrackEndEvent",
      track: this.queue[0] ? this.queue[0].track : null,
      guildId: this.guildId,
    });
    this.setVolume(this.volume);
    const trackLavalink = this.queue[0] ? this.queue[0].track : undefined;
    if (!trackLavalink) return this.stop();
    return this.mgr.ws
      .send({
        op: "play",
        guildId: this.guildId,
        startTime: start,
        endTime: end,
        noReplace: false,
        pause: false,
        track: this.queue[0].track,
      })
      .then(() => {
        this.state = "PLAYING";
      });
  }

  pause() {
    if (this.state !== "PLAYING") return;
    return this.mgr.ws
      .send({
        op: "pause",
        guildId: this.guildId,
        pause: true,
      })
      .then(() => (this.state = "PAUSED"));
  }

  resume() {
    if (this.state !== "PAUSED") return;
    return this.mgr.ws
      .send({
        op: "pause",
        guildId: this.guildId,
        pause: false,
      })
      .then(() => (this.state = "PLAYING"));
  }

  setVolume(volume = 100) {
    volume = Number(volume);
    if (isNaN(volume)) throw new TypeError("Volume must be a number.");
    this.volume = Math.max(Math.min(volume, 1000), 0);

    return this.mgr.ws.send({
      op: "volume",
      guildId: this.guildId,
      volume: this.volume,
    });
  }

  setTextChannel(channel) {
    this.text = channel;
  }

  setPrune(bool) {
    this.prune = bool;
  }

  stop() {
    this.queue = [];
    this.state = "ENDED";
    return this.mgr.ws.send({
      op: "stop",
      guildId: this.guildId,
    });
  }

  seek(ms) {
    this.mgr.ws.send({
      op: "seek",
      guildId: this.guildId,
      position: ms,
    });
  }

  setTrackLoop(loop = false) {
    const boolean = loop === true;
    this.loopTrack = boolean;
  }

  setQueueLoop(loop = false) {
    const boolean = loop === true;
    this.loopQueue = boolean;
  }
}

module.exports = MediaPlayer;
