const v = require('@discordjs/voice')
const {Collection} = require('discord.js')
const {EventEmitter} = require('events')
const fs = require('fs')
const {Readable} = require('stream')
const {TrackTypes,VoiceStates,VoiceEvents} = require('../../Utils/VoiceConstants.js')
const MusicCacher = require('./musicCacher.js')
const timer = (task,ms) => new Promise(res=>setTimeout(()=>res(task),ms))
const Track = require('./track.js')
const FFmpeg = require('./ffmpeg.js')
const Search = require('./search.js')
const AoiError = require('../../classes/AoiError.js')
class Subscription extends EventEmitter {
    constructor(connection,Voice){
        super();
        this.connection = connection 
        this.Voice = Voice 
        this.queue = []
        this.search = Search 
        this.singleTrack = null 
        this.ffmpeg = new FFmpeg()
        this.cacher = new MusicCacher() 
        this.player = v.createAudioPlayer()
        this._defaultOptions()
        this._defaultStates()
        this._configPlayer()
        this._configConnection()
    }
    //queue 
    addToQueue(trackInfo,resource,stream,author,platform){
        this.queue.push(new Track(trackInfo,resource, stream,author,platform))
    }
    moveInQueue(oldpos,newpos){
        if(newpos <= this.queue.length){
            this.queue.splice(newpos,0,this.queue[oldpos])
        }
        this.queue.splice(oldpos,1)
    }
    //track 
  async addTrack(track,type,author){
        if(type===0){
            const urls = await this.search.Youtube.search(track,this.Voice.ytdl)
            for(const url of urls){
                try{
                const yt = await this.search.Youtube.getData(url,this.Voice.ytdl)
                const stream = await this.ffmpeg.transformStream(yt.stream)//yt.stream
                const res = await v.createAudioResource(stream,{inlineVolume:true})
               this.addToQueue(yt.info,res,yt.stream,author, type)
                if(this.queue.length === 1){
                   // console.log("playing")
                    this._playTrack()
                }
            }
                catch(e){
                    AoiError.consoleError("YoutubeSearchError:"+e)
                }
                await timer("",this.Voice.timer||10000)
                }
        }
        else if(type===1){
            const infos = await this.search.SoundCloud.search(track,this.Voice.sc)
            for(const info of infos){
                try{
               // console.log(info)
                const rawStream =await this.search.SoundCloud.download(info.permalink_url,this.Voice.sc)
                const stream = await this.ffmpeg.transformStream(rawStream)
                const res = await v. createAudioResource(stream,{inlineVolume:true})
                this.addToQueue(info,res,rawStream,author, type)
                if(this.queue.length === 1){
                    this._playTrack()
        }
                    }
                catch(e){
                    AoiError.consoleError("SoundCloudSearchError",e)
                }
                await timer("",this.Voice.timer||10000)
            }
        }
        else if(type===2){
            const rawStream = fs.createReadStream(process.cwd()+"/"+track)
            const stream = this.ffmpeg.transformStream(rawStream)
            const res = v.createAudioResource(stream,{inlineVolume:true})
            this.addToQueue({},res,rawStream,author, type)
            if(this.queue.length === 1){
                this._playTrack()
            }
        }
        else{
            AoiError.consoleError("AudioTypeError","Invalid Audio Type Provided")
        }
    }
  async _playTrack(){
      this.player.play(this.queue[0]. resource)
                    try{
                        await v.entersState(this.player,v.AudioPlayerStatus.Playing,10000)
                        this.emit(VoiceEvents.START,this.queue[0].info)
                    }
                    catch(e){
                        AoiError.consoleError("PlayerError",e)
                        this.emit(VoiceEvents.ERROR,e)
                    }
  }
  async _loopingTrack(){
      const q = this.queue.shift()
      this._playTrack()
      const {Stream,Res} = await this.cacher.cacheTrack(q)
      q.stream = Stream 
      q.resource = Res
      this.queue.push(q)
  }
  async _playSingleTrack(){
      const {Stream,Res} = this.cacher.cacheTrack(this.singleTrack)
      this.singleTrack.stream = Stream 
      this.singleTrack.resource = Res 
      this.player.play(this.singleTrack.resource)
                    try{
                        await v.entersState(this.player,v.AudioPlayerStatus.Playing,10000)
                    }
                    catch(e){
                        AoiError.consoleError("PlayerError",e)
                        this.emit(VoiceEvents.ERROR,e)
                    }
  }
  async _destroyPlayer(){
      this.player.stop()
      this._defaultOptions()
      this._defaultStates()
      this.queue=[]
      this.singleTrack=null
  }
  async _playNextTrack(){
      this.queue.shift() 
      this._playTrack()
  }
   //options
    loopQueue(){
    this.options.loopQueue = this.options.loopQueue ? false : true
        this.states.loop = this.options.loopQueue ? VoiceStates.loop.QUEUE : VoiceStates.loop.NONE
    return this.options.loopQueue 
}
    loopSong(){
        this.options.loopSong = this.options.loopSong ? false : true 
this.states.loop = this.options.loopSong ? VoiceStates.loop.SONG : VoiceStates.loop.NONE
        return this.options.loopSong 
    }
    pause(){
        this.options.paused =  true
        this.player.pause()
        return true 
    }
    resume(){
        this.options.paused = false 
        this.player.unpause()
        return false 
    }
    setVolume(number){
        this.options.volume = number 
        this.queue[0].resource.volume.setVolume(number/100)
    }
    getVolume(){
        return this.options.volume 
    }
    getCurrentDuration(){
        return this.queue[0].resource.playbackDuration()
    }
    getDurationLeft(){
        return (this.queue[0].info.duration - this.getCurrentDuration())
    }
   get queueLength(){
        return this.queue.length
    }
    songInfo(property,position){
        return this.queue[position].info[property]
    }
    songRawInfo(property, position){
        return eval(`this.queue[position].rawInfo.${property}`)
    }
    skipSong(){
        if(this.options.loopSong){this._playSingleTrack}
        else if(this.options.loopQueue){this._loopingTrack}
        else this._playNextTrack()
    }
    //default options 
    _defaultOptions(){
        this.options = {
            paused:false,
            loopSong:false,
            loopQueue:false,
            volume:100,
            leaveAfter:60000,
            leaveVcWhenEmpty:false 
        }
    }
    _defaultStates(){
        this.states = {
            queue:VoiceStates.queue.IDLE,
            loop:VoiceStates.loop.NONE,
            player: this.player.state.status 
        }
    }
    _configPlayer(){
        this.player.on("stateChange",(os,ns)=>{
            //console.log([os.status,ns.status].join("|"))
            if(os.status !== v.AudioPlayerStatus.Idle && ns.status === v.AudioPlayerStatus.Idle){
                if(this.options.paused){}
                else if(this.options.loopSong && this.singleTrack){
                    this._playSingleTrack()
                }
                else if(this.options.loopQueue && this.queue.length){
                   this._loopingTrack()
                }
                else if(this.queue.length > 1){
                    this._playNextTrack()
                }
                else{
                    this._destroyPlayer()
                }
            }
        })
        this.player.on("error",(message)=>this.emit(VoiceEvents.ERROR,message))
        this.connection.subscribe(this.player)
    }
    _configConnection(){
        this.connection.on("stateChange",async (os,ns)=>{
            if(ns.status === v.VoiceConnectionStatus.Disconnected){
                if(ns.reason === v.VoiceConnectionDisconnectReason.WebsocketClose && ns.closeCode === 4014){
                    this.Voice.servers.delete(this.connection.joinConfig.guildId)
                    this.connection.destroy()
                }
                else if(this.connection.rejoinAttempts <this.Voice.connectionOptions?.rejoinAttempts||5){
                    try{
                      await timer(this.connection.rejoinAttempts+1,5000)
                        this.connection.rejoin()
await v.entersState(this.connection,v.VoiceConnectionStatus.Connecting,5000)
                    }
                    catch(e){
                        console.error(e)
                        this.emit(VoiceEvents.ERROR,e)
                        this.connection.destroy()
                    }
                }
                else {
                    this.Voice.servers.delete(this.connection.joinConfig.guildId)
                    this.connection.destroy()  
                }
            }
        })
    }
    //misc 
    emit(name,...data){
        this.Voice.emit(name,...data)
    }
}
module.exports = Subscription;
