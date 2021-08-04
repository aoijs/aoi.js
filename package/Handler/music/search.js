const musicWorker = require('./musicWorker.js')
const scdl = require('soundcloud-downloader'). default
const ytdl = require('ytdl-core-discord')
const sclink = ["https://soundcloud.com","https://m.soundcloud.com"]
const link = ['https://youtube.com/watch?v=','https://youtube.com', 'https://www.youtube.com','https://m.youtube.com','https://music.youtube.com','https://gaming.youtube.com',"https://youtu.be"]
const playlist = /playlist\?list=(.+)/;
const timer =(ms)=> new Promise(res=>setTimeout(()=>res(),ms))
const Search ={
Youtube : class Youtube {
    constructor(){}
    static async search(track){
     try{
        if(link.some(x=>x.startsWith(track.split("/").slice(0,3).join("/")))){
            if(track.match(playlist)){
     const playlist = await musicWorker({listId:track.split("?list=")[1]})
     return playlist
            }
            else{
         return [track]
        }
            }
  else {
    const yt = await musicWorker(track)
    return [yt]
  }
         }
        catch(e){
            console.error("YouTubeSearchError:"+e)
        }
    }
    static async  getData(url,yt){
      const info = await ytdl.getInfo(url,yt)
      const stream = await ytdl.downloadFromInfo(info,yt)
      return {info,stream}
    }
},
SoundCloud : class SoundCloud {
    constructor(){}
    static async  search(track,limit=1,clientID){
       try{
if(sclink.some(x=>track.startsWith(x))){
          if(track.split("/")[4]==="sets"){
             const collection = await this.getPlaylist(track,clientID)
             return collection
          }
    else if(track.endsWith("likes")){
        console.log("like tracks")
       const y = track.split("/")
       y.pop() 
       const {collection} = await  scdl.getLikes({profileUrl:y.join("/")},clientID === ""? undefined:"")
       //console.log(collection)
       return collection.map(x=>x.track)
    }
     else{
         const tr = await this.getTrack(track,clientID)
         return [tr]
     }
      }
       else{
     const info = await scdl.search({query:track, limit:1},clientID)
     return info.collection
           }
           }
       catch(e){
        console.error("SoundCloudSearchError:"+e) 
           return false 
       }
   }
    static async  getTrack(url, clientID=""){
      const info = await scdl.getInfo(url,clientID)
      return info 
   }
    static async getPlaylist(url, clientID=""){
      const data = await  scdl.getSetInfo(url,clientID)
      return data.tracks
   }
    static async download(url,clientID=""){
       const stream = await scdl.download(url,clientID)
       return stream 
   }
    static async downloadMedia(transcoding,clientID="",userAgent=null){
       const stream = await scdl.downloadMedia(transcoding,clientID)
       return stream;
   }
}
}
module.exports = Search;