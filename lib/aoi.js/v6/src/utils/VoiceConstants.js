const VoiceOptions = {
    client: "<class<Bot>>",
    ytdl: "YtdlOptions",
    soundcloud: "SoundCloud Client ID",
    cache: "<CacheOptions>",
    other: "any",
};
const VoiceSubscriptionDefaultOptions = {
    paused: false,
    loopQueue: false,
    loopSong: false,
    volume: 100,
    leaveAfter: 60000,
    leaveWhenEmpty: false,
};
const States = {
    queue: {
        IDLE: "idle",
        PLAYING: "playing",
        PAUSED: "paused",
    },
    loop: {
        NONE: "none",
        QUEUE: "queue",
        SINGLE: "single",
    },
};
const Events = {
    ERROR: "musicError",
    TRACK_START: "musicStart",
    QUEUE_END: "queueEnd",
    TRACK_END: "trackEnd",
};
const TrackTypes = ["YouTube", "SoundCloud", "File"];
module.exports = {
    VoiceOptions: VoiceOptions,
    VoiceSubscriptionDefaultOptions: VoiceSubscriptionDefaultOptions,
    States,
    Events: Events,
    TrackTypes: TrackTypes,
};
