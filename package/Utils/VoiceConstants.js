const VoiceOptions = {
client:"<class<Bot>>",
ytdl:"YtdlOptions",
soundcloud:"SoundCloud Client ID",
cache:"<CacheOptions>",
other:"any"
}
const VoiceSubscriptionDefaultOptions = {
    paused:false,
    loopQueue:false,
    loopSong:false,
    volume:100,
    leaveAfter:60000,
    leaveWhenEmpty:false
}
const VoiceStates = {
    queue:{
        IDLE:"idle",
        PLAYING:"playing",
        PAUSED:"paused"
    },
    loop:{
        NONE:"none",
        QUEUE:"queue",
        SINGLE:"single"
    }
}
const VoiceEvents = {
    ERROR:"musicError",
    TRACK_START:"musicStart",
    QUEUE_END:"musicEnd"
}
const TrackTypes = ["YouTube","SoundCloud","File"]
module.exports = {
VoiceOptions : VoiceOptions,
VoiceSubscriptionDefaultOptions:VoiceSubscriptionDefaultOptions,
VoiceStates:VoiceStates,
VoiceEvents:VoiceEvents ,
TrackTypes : TrackTypes 
}