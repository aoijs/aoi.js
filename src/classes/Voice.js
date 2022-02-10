const { Manager, PlayerEvents } = require("music/lib/index");
const { CommandManager } = require("./Commands.js");

class Voice extends Manager {
  constructor(client, config) {
    super(config);
    this.functionManager = client.functionManager;
    this.client = client;
    client.voiceManager = this;
    new CommandManager(this, false, Object.values(PlayerEvents));
  }

  get playerSize() {
    return this.players.size;
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
    this.on(PlayerEvents.AUDIO_ERROR, async (error, textChannel) =>
      require("../handler/music/events/audioError.js")(
        error,
        textChannel,
        this.client,
        this,
      ),
    );
  }
  onTrackStart() {
    this.on(PlayerEvents.TRACK_START, async (track, textChannel) =>
      require("../handler/music/trackStart.js")(
        track,
        textChannel,
        this.client,
        this,
      ),
    );
  }
  onQueueStart() {
    this.on(PlayerEvents.QUEUE_START, async (track, textChannel) =>
      require("../handler/music/queueStart.js")(
        track,
        textChannel,
        this.client,
        this,
      ),
    );
  }
  onTrackEnd() {
    this.on(PlayerEvents.TRACK_END, async (track, textChannel) =>
      require("../handler/music/trackEnd.js")(
        track,
        textChannel,
        this.client,
        this,
      ),
    );
  }
  onQueueStart() {
    this.on(PlayerEvents.QUEUE_END, async (track, textChannel) =>
      require("../handler/music/queueEnd.js")(
        track,
        textChannel,
        this.client,
        this,
      ),
    );
  }
  onTrackPause() {
    this.on(PlayerEvents.TRACK_PAUSE, async () =>
      require("../handler/music/trackPause.js")(this.client, this),
    );
  }
  onTrackResume() {
    this.on(PlayerEvents.TRACK_RESUME, async () =>
      require("../handler/music/trackResume.js")(this.client, this),
    );
  }
}

module.exports = Voice;
