const { Manager, PlayerEvents } = require("music/lib/index");
const { CommandManager } = require( "./Commands.js" );

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
    this.on(PlayerEvents.AUDIO_ERROR, async (error,textChannel) =>
      require("../handler/music/events/audioError.js")(
        error,
        textChannel,
        this.client,
      ),
    );
  }
  onTrackStart() {
    this.on(PlayerEvents.TRACK_START, async (track, textChannel) =>
      require("../handler/music/events/trackStart.js")(
        track,
        textChannel,
        this.client,
      ),
    );
  }
  onQueueStart() {
    this.on(PlayerEvents.QUEUE_START, async (track, textChannel) =>
      require("../handler/music/events/queueStart.js")(
        track,
        textChannel,
        this.client,
      ),
    );
  }
  onTrackEnd() {
    this.on(PlayerEvents.TRACK_END, async (track, textChannel) =>
      require("../handler/music/events/trackEnd.js")(
        track,
        textChannel,
        this.client,
      ),
    );
  }
  onQueueStart() {
    this.on(PlayerEvents.QUEUE_END, async (track, textChannel) =>
      require("../handler/music/events/queueEnd.js")(
        track,
        textChannel,
        this.client,
      ),
    );
  }
  onTrackPause() {
    this.on(PlayerEvents.TRACK_PAUSE, async () =>
      require("../handler/music/events/trackPause.js")(this.client),
    );
  }
  onTrackResume() {
    this.on(PlayerEvents.TRACK_RESUME, async () =>
      require("../handler/music/events/trackResume.js")(this.client),
    );
  }
}

module.exports = Voice;
