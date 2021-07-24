const PlayerStates = {
    IDLE: "player_idle",
    PLAYING: "player_playing",
    PAUSED: "player_pause",
    TRACK_CHANGE: "player_tr_change",
    DESTROYED: "player_died",
    STOPPED: "player_forced_stop"
}

const LavalinkIncomingMessageType = {
    playerUpdate: "playerUpdate",
    status: "stats",
    event: "event"
}

const LavalinkEvents = {
    TrackStartEvent: "TrackStartEvent",
    TrackEndEvent: "TrackEndEvent",
    TrackExceptionEvent: "TrackExceptionEvent",
    TrackStuckEvent: "TrackStuckEvent"
}

module.exports = {
    PlayerStates,
    LavalinkIncomingMessageType,
    LavalinkEvents,
    version: "1.0.0-beta"
}
