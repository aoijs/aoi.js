const ytdl =require('ytdl-core-discord') 
const yts = require('./musicWorker.js')
const link = ['https://youtube.com/watch?v=','https://youtube.com', 'https://www.youtube.com','https://m.youtube.com','https://music.youtube.com','https://gaming.youtube.com',"https://youtu.be"]
const playlist = /playlist\?list=(.+)/;
const timer =(ms)=> new Promise(res=>setTimeout(()=>res(),ms))
const Youtube = {
  async search(track){
        if(link.some(x=>x.startsWith(track.split("/").slice(0,3).join("/")))){
            if(track.match(playlist)){
     const playlist = await yts({listId:track.split("?list=")[1]})
     return playlist
            }
            else{
         return [track]
        }
            }
  else {
    const yt = await yts(track)
    //console.log("yt:"+yt)
    return [yt]
  }
                 },
   async  getData(url,options={filter:"audioonly",format:"highestaudio",dlChunkSize:0}){
      const info = await  ytdl.getInfo(url,options)
      const stream = await ytdl.downloadFromInfo(info,options) 
   return    {info:info,stream:stream}
    },
}
module.exports = Youtube;
