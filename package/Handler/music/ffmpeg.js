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
    const opus = new prism.opus.Encoder({

        rate:48000,channels:2,frameSize:960

    })
    return stream.pipe(ffmpeg).pipe(opus)
}
seekTo(timestamp, stream){
    const ffmpeg = new prism.FFmpeg({

        args: this.args 

    })
    const opus = new prism.opus.Encoder({

        rate:48000,channels:2,frameSize:960

    })
    this.setSeekTo(timestamp)
    return stream.pipe(ffmpeg).pipe(opus)
}
 setSeekTo(timestamp){
     const time = ms(timestamp)
    this.seekTo = `${time/1000}`.split(".")[0]
 }
 setFilters(stream,...filters){
     
     const opus = new prism.opus.Encoder({

        rate:48000,channels:2,frameSize:960

    })
     this.filters.push(...filters)
     if(this.args.find(x=>x === "-af")){
         const index = this.args.indexOf("-af")
         this.args[index+1] = filters.join(":") 
         }
     else{
         this.args.push("-af",filters.join(":"))
     }
     if(stream){
         if(stream.platform === "SoundCloud"){
         const ffmpeg = new prism.FFmpeg({

        args:["-i",`${stream.rawInfo.media.transcodings[2].url}`,...this.args]

    })
     ffmpeg
             }
     }
     else return this.filters 
     }
 }

module.exports = FFmpeg;