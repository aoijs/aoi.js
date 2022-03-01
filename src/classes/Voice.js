try {
  const { Manager, PlayerEvents } = require("@akarui/aoi.music/lib/index.js");

  const { CommandManager } = require("./Commands.js");

  class Voice {
    constructor(client, config, pruneMusic) {
      this.manager = new Manager(config);
      this.functionManager = client.functionManager;
      this.client = client;
      this.pruneMusic = pruneMusic;
      this.prunes = new Map();
      client.voiceManager = this;
      new CommandManager(this, false, Object.values(PlayerEvents));
    }

    get playerSize() {
      return this.manager.players.size;
    }

    trackStartCommand(d = {}) {
      this.cmd[PlayerEvents.TRACK_START].set(
        this.cmd[PlayerEvents.TRACK_START].size,
        d,
      );
    }

    queueStartCommand(d = {}) {
      this.cmd[PlayerEvents.QUEUE_START].set(
        this.cmd[PlayerEvents.QUEUE_START].size,
        d,
      );
    }

    trackEndCommand(d = {}) {
      this.cmd[PlayerEvents.TRACK_END].set(
        this.cmd[PlayerEvents.TRACK_END].size,
        d,
      );
    }

    queueEndCommand(d = {}) {
      this.cmd[PlayerEvents.QUEUE_END].set(
        this.cmd[PlayerEvents.QUEUE_END].size,
        d,
      );
    }

    audioErrorCommand(d = {}) {
      this.cmd[PlayerEvents.AUDIO_ERROR].set(
        this.cmd[PlayerEvents.AUDIO_ERROR].size,
        d,
      );
    }
    trackResumeCommand(d = {}) {
      this.cmd[PlayerEvents.TRACK_RESUME].set(
        this.cmd[PlayerEvents.TRACK_RESUME].size,
        d,
      );
    }
    trackPauseCommand(d = {}) {
      this.cmd[PlayerEvents.TRACK_PAUSE].set(
        this.cmd[PlayerEvents.TRACK_PAUSE].size,
        d,
      );
    }
    onAudioError() {
      this.manager.on(PlayerEvents.AUDIO_ERROR, async (error, textChannel) =>
        require("../handler/music/audioError.js")(
          error,
          textChannel,
          this.client,
          this,
        ),
      );
    }
    onTrackStart() {
      this.manager.on(PlayerEvents.TRACK_START, async (track, textChannel) =>
        require("../handler/music/trackStart.js")(
          track,
          textChannel,
          this.client,
          this,
        ),
      );
    }
    onQueueStart() {
      this.manager.on(PlayerEvents.QUEUE_START, async (urls, textChannel) =>
        require("../handler/music/queueStart.js")(
          urls,
          textChannel,
          this.client,
          this,
        ),
      );
    }
    onTrackEnd() {
      this.manager.on(PlayerEvents.TRACK_END, async (track, textChannel) =>
        require("../handler/music/trackEnd.js")(
          track,
          textChannel,
          this.client,
          this,
        ),
      );
    }
    onQueueEnd() {
      this.manager.on(PlayerEvents.QUEUE_END, async (textChannel) =>
        require("../handler/music/queueEnd.js")(textChannel, this.client, this),
      );
    }
    onTrackPause() {
      this.manager.on(PlayerEvents.TRACK_PAUSE, async (textChannel) =>
        require("../handler/music/trackPause.js")(
          textChannel,
          this.client,
          this,
        ),
      );
    }
    onTrackResume() {
      this.manager.on(PlayerEvents.TRACK_RESUME, async (textChannel) =>
        require("../handler/music/trackResume.js")(
          textChannel,
          this.client,
          this,
        ),
      );
    }
  }

  module.exports = Voice;
} catch (e) {
  class Voice {
    constructor() {
      throw new Error("install @akarui/aoi.music to use this feature");
    }
  }
  module.exports = Voice;
}
