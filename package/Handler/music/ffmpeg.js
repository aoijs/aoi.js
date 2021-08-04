const prism = require('prism-media')
const ms = require('ms')
const {createAudioResource} = require('@discordjs/voice')
class FFmpeg {
 constructor(){
this.seekTo = "00:00:00"
     this.args = [
    '-analyzeduration', '0',
    '-loglevel', '0',
    '-f', 's16le',
    '-ar', '48000',
    '-ac', '2',
    '-ss',this.seekTo
  ]
     this.filters = []
 }
transformStream(stream){
    this.seekTo = "00:00:00"
    const ffmpeg = new prism.FFmpeg({
        args: this.args 
    })
  const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 })
    return stream.pipe(ffmpeg).pipe(opus)
}
seekTo(timestamp, stream){
    const ffmpeg = new prism.FFmpeg({
        args: this.args 
    })
    this.setSeekTo(timestamp)
    return stream.pipe(ffmpeg)
}
 setSeekTo(timestamp){
     const time = ms(timestamp)
    this.seekTo = `${time/1000}`.split(".")[0]
 }
 }

module.exports = FFmpeg;