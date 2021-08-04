const {Transform} = require('stream')
const streamer = new Transform()

streamer._transform = async(chunk,_,done)=>{
   this.data = Buffer.alloc(0)
    this.lastData = null 
   if(this.data) this.data = Buffer.alloc([this.data,chunk])
    this.lastData = chunk
    this.push(chunk)
    done()
}
streamer._flush = async done =>{
    if(this.lastData) this.push(this.lastData)
    this.lastData = null 
}
module.exports = streamer;