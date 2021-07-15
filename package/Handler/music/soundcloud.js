const scdl = require('soundcloud-downloader'). default 

const link = ["https://soundcloud.com","https://m.soundcloud.com"]
const SoundCloud = {
   async search(track,limit=1,clientID=""){
       try{
if(link.some(x=>x.startsWith(track.split("/").slice(0,3).join("/")))){
          if(track.split("/")[4]==="sets"){
             const collection = await this.getPlaylist(track,clientID)
             return collection
          }
    else if(track.endsWith("likes")){
       const y = track.split("/")
       y.pop() 
       const {collection} = await  scdl.getLikes({profileUrl:y.join("/")},clientID)
       return collection.map(x=>x.track)
       // console.log(likes)
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
        console.error(e) 
           return false 
       }
   },
   async getTrack(url, clientID=""){
      const info = await scdl.getInfo(url,clientID)
      return info 
   },
   async getPlaylist(url, clientID=""){
      const data = await  scdl.getSetInfo(url,clientID)
      return data.tracks
   },
   async download(url,clientID=""){
       const stream = await scdl.download(url,clientID)
       return stream 
   },
   async downloadMedia(transcoding,clientID="",userAgent=null){
       const stream = await scdl.downloadMedia(transcoding,clientID)
       return stream;
   }
}
module.exports = SoundCloud;