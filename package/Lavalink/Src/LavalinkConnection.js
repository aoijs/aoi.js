/*
    Copyright (c) 2021 Andrew Trims and Contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const API = require("./HTTP");
const Player = require("./Player");
const Websocket = require("./Websocket");
const EventEmitter = require("events").EventEmitter;
const VoiceStateTypes = ["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"];
const { LavalinkIncomingMessageType, LavalinkEvents, PlayerStates } = require("./Util");
const apiBody = {
  op: 4,
  d: {
    guild_id: null,
    channel_id: null,
    self_mute: false,
    self_deaf: false
  }
};

class LavalinkConnection extends EventEmitter {
  /**
   * 
   * @param {"example.com"} LavalinkURL 
   * @param {string} LavalinkAuthorizationPassword 
   * @param {`${bigint}`} UserId
   */
    constructor(LavalinkURL, LavalinkAuthorizationPassword, UserId, ShardAmount = 1, WebsocketOptions = {}) {
        super();
        /** @type {Map<`${bigint}`, Player>} */
        this._players = new Map();
        /** @type {Websocket} */
        this._ws = new Websocket(this, {
          userID: UserId,
          password: LavalinkAuthorizationPassword,
          url: LavalinkURL,
          shardCount: ShardAmount,
          ...WebsocketOptions
        });
        this._useSafe = WebsocketOptions.useSafeProtocol;
        this.userId = UserId;
        /** @type {import("../index").LavalinkStatusMessage} */
        this.hostStatus = {};
        this._uri = LavalinkURL;
        this._pass = LavalinkAuthorizationPassword;
        /** @type {Map<`${bigint}`, import("../index").LavalinkPacketVoiceState>} */
        this.voiceStates = new Map();
    }

    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @returns 
     */
    createAudioPlayer(guild) {
      let player = this._players.get(guild.id);

      if (!player) {
        const opt = [this._uri, this._pass];
        opt.push(this);
        player = new Player(...opt);
        this._players.set(guild.id, player);
      }

      const state = this.voiceStates.get(guild.id);
      if (state) player.voiceState = state;

      return player;
    }

    trackVoiceStateUpdates() {
        return (packet) => {

          if (!VoiceStateTypes.includes(packet.t || "")) return;

        const state = this.voiceStates.get(packet.d.guild_id) || {};
        
        if (packet.t === "VOICE_SERVER_UPDATE") {

            state.op = "voiceUpdate";
            state.guildId = packet.d.guild_id;
            state.event = packet.d;
          } else {
            if (packet.d.user_id === this.userId) {
              state.guildId = packet.d.guild_id;
              state.sessionId = packet.d.session_id;

              if (packet.d.channel_id !== state.channelId)
                  state.channelId = packet.d.channel_id;
            }
          }

          this.voiceStates.set(state.guildId, state);

          if (
            state.sessionId && state.guildId &&
            state.event && state.op
          ) {
            this._ws.send(state);

          }

          const player = this._players.get(packet.d.guild_id);
          if (player) player.voiceState = state;

        }
    }

    async search(searchQuery, requesterUserId) {

      const results = await API.load(searchQuery, this._uri, this._pass, this._useSafe);
      /** @type {import("../index").RawTrack} */
      const track = results.tracks[0];
      if (!track) return;
      
      return this._buildTrack(track, requesterUserId);
    }

    /**
     * 
     * @param {import("../index").LavalinkIncomingMesssage} d 
     */
    handleMessage(d) {
      if (d.op === LavalinkIncomingMessageType.event) 
      {
        this.handleEvent(d);
      } else if (d.op === LavalinkIncomingMessageType.playerUpdate) {
        if (!d.guildId) return;

        const Player = this._players.get(d.guildId);
        if (!Player) return;

        Player.timeState = d.state.position;
        Player.lavalinkPlayerStatus = d.state;
      } else if (d.op === LavalinkIncomingMessageType.status) {
        this.hostStatus = d;
      }
    }

    /**
     * 
     * @param {import("../index").LavalinkIncomingMesssage} d 
     */
    handleEvent(d) {
      const Player = this._players.get(d.guildId);

      if (!Player) return;
      
      switch(d.type) {
        case LavalinkEvents.TrackStartEvent: {
          Player.state = PlayerStates.PLAYING;
        }
        break;
        case LavalinkEvents.TrackEndEvent: {
          Player.state = PlayerStates.IDLE;
        }
        break;
        case LavalinkEvents.TrackExceptionEvent: {
          Player.state = PlayerStates.IDLE
        }
      }
    }
    /**
     * 
     * @param {import("discord.js").Guild} guild 
     * @param {import("discord.js").VoiceChannel} channel
     */
    joinVoiceChannel(guild, channel, selfDeaf = false, selfMute = false) {
      if (guild.shard.status !== 0) return;
      const body = {...apiBody};
      body.d.guild_id = guild.id;
      body.d.channel_id = channel.id;
      body.d.self_deaf = selfDeaf;
      body.d.self_mute = selfMute;

      guild.shard.send(body);
    }
    /**
     * 
     * @param {import("discord.js").Guild} guild 
     */
    leaveVoiceChannel(guild) {
      if (guild.shard.status !== 0) return;

      const body = {...apiBody, guild_id: guild.id};
      guild.shard.send(body);
    }

    listenDebug() {
      this.on("debug", (message) => console.log(message));
    }

    /**
     * 
     * @param {import("../index").RawTrack} rawtrack 
     * @returns {import("../index").Track}
     */
    _buildTrack(rawtrack, requesterUserId) {
      let thumbnail = `https://img.youtube.com/vi/${rawtrack.info.identifier}/maxresdefault.jpg`;
      if (rawtrack.info.sourceName === "soundcloud" || rawtrack.info.identifier.includes("stream/hls")) thumbnail = "";

      return {
        title: rawtrack.info.title,
        id: rawtrack.info.identifier,
        publisher: rawtrack.info.author,
        lengthSeconds: rawtrack.info.length / 1000,
        duration: this._resolveDuration(rawtrack.info.length),
        isStream: rawtrack.info.isStream,
        url: rawtrack.info.uri,
        thumbnail,
        encoded: rawtrack.track,
        requesterId: requesterUserId
      }
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
}

module.exports = LavalinkConnection;
