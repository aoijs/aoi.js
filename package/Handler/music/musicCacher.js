const streamer = require('./transform.js')
const {createAudioResource} = require('@discordjs/voice')
const {Collection} = require('discord.js')
class Cacher  {
    constructor(){
        this.cache = new Collection()
    }
    cacheTrack(track){
        const Stream = track.stream.pipe(streamer)
        const Resource = createAudioResource(Stream)
        track.stream = Stream 
        track.resource = Resource 
       this.cache.set(track.info.ID,track)
}
}
module.exports = Cacher 