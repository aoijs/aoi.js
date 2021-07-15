const FFmpeg = require('./ffmpeg.js')
const YouTube = require('./youtube.js')
const Sc = require('./soundcloud.js')
const Track = require('./track.js')
const timer = (task,ms)=>new Promise(res=>setTimeout(()=>res(task),ms))
const {EventEmitter} = require('events')
const voice = require('@discordjs/voice')
class Subscription extends EventEmitter {
    constructor(connection,Voice){
        super();
        this.player = voice.createAudioPlayer() 
        this.connection = connection
        this.Voice = Voice 
        this.ffmpeg = new FFmpeg() 
        this.queue = []
        this.singleTrack = null 
        this.defaultOptions()
        this.defaultStates()
        this.configPlayer()
        this.configConnection()
    }
//private methods // defining methods (ignore them not important)
    defaultOptions(){
        this.options = {
            //track  options 
            paused:false,
            volume:100,
            //queue  options 
            loopQueue:false,
            loopSong:false,
            lockQueue:false,
            //connection  options 
            leaveVc:{
                after:60000,
                enabled:true,
        },
            leaveVcWhenEmpty:false,
            //cache options 
            cache:this.Voice.cache
            }
    }
    defaultStates(){
        this.states={
            queue:"idle",
            loop:"none",
            player:this.player.state.status
        }
    }
    configPlayer(){
        this.player.on("stateChange",(os,ns)=>{
            if(os.status !== voice.AudioPlayerStatus.Idle && ns.status === voice.AudioPlayerStatus.Idle){
                if(this.options.paused){}
                else if(this.options.loopSong && this.singleTrack){
                    this.playSingleTrack()
                }
                else if(this.options.loopQueue && this.queue.length){
                   const q = this.queue.shift() 
                   this.playNextTrack()
                    this.queue.push(q)
                }
                else if(this.queue.length > 1){
                    this.playNextTrack()
                }
                else{
                    this.destroyPlayer()
                }
            }
        })
        this.player.on("error",(message)=>this.emit("musicPlayerError",message))
        this.connection.subscribe(this.player)
    }
    configConnection(){
        this.connection.on("stateChange",async (os,ns)=>{
            if(ns.status === voice.VoiceConnectionStatus.Disconnected){
                if(ns.reason === voice.VoiceConnectionDisconnectReason.WebsocketClose && ns.closeCode === 4014){
                    this.Voice.servers.delete(this.connection.joinConfig.guildId)
                    this.connection.destroy()
                }
                else if(this.connection.rejoinAttempts <this.Voice.connectionOptions.rejoinAttempts){
                    try{
                      await timer(this.connection.rejoinAttempts+1,5000)
                        this.connection.rejoin()
await voice.entersState(this.connection,voice.VoiceConnectionStatus.Connecting,5000)
                    }
                    catch(e){
                        console.error(e)
                        this.emit("musicConnectionError",e)
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
//queue methods 
    addToQueue(trackInfo,resource,stream,author,platform){
        this.queue.push(new Track(trackInfo,resource, stream,author,platform))
    }
    moveInQueue(oldpos,newpos){
        if(newpos <= this.queue.length){
            this.queue.splice(newpos,0,this.queue[oldpos])
        }
        this.queue.splice(oldpos,1)
    }
//tracks methods
 async addTrack(query,type,author){
        if(type === "youtube"){
            const tracks = await YouTube.search(query,this.Voice?.ytOptions)
            for(const track of tracks){
                const yt = await YouTube.getData(track,this.Voice?.ytOptions)
            const stream = await this.ffmpeg.transformStream(yt.stream)
            const resource = voice.createAudioResource(stream,{inlineVolume:true})
            if(!this.queue.length){
                this.player.play(resource)
                try{
                    await voice.entersState(this.player,voice.AudioPlayerStatus.Playing,10000)
                }
                catch(e){
                    console.error(e)
                    this.emit("musicPlayerError",e)
                }
            }
            this.addToQueue(yt.info, resource,yt.stream,author,type)
        }
            }
        else if(type === "SoundCloud"){
            const tracks = await Sc.search(query,1,this.Voice?.scOptions)
            for(const track of tracks){
            const scstream = await Sc.download(track.permalink_url,this.Voice.scOptions)
            const stream = await this.ffmpeg.transformStream(scstream)
            const resource = voice.createAudioResource(stream,{inlineVolume:true})
            if(!this.queue.length){
                this.player.play(resource)
                try{
                    await voice.entersState(this.player,voice.AudioPlayerStatus.Playing,10000)
                }
                catch(e){
                    console.error(e)
                    this.emit("musicPlayerError",e)
                }
            }
            this.addToQueue(track, resource,scstream,author,type)
        }
            }
    }
 async nextTrack(){
    let q = this.queue.shift() 
    
 }
}
module.exports = Subscription;