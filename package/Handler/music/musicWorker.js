const {Worker} = require('worker_threads')
function doWork(workerData){ 
   const e = new Promise((res,rej)=>{
        let msg;
    const worker = new Worker(__dirname+"/ytSearch.js",{workerData})
    worker.on("message", message=>{
        return res(message)
console.log(message)})
    worker.on("error",err=>rej(err))
    worker.on("exit",code=>{
        if(code !== 0){
            rej(console.error(`Error Occured`))
        }
        })
})
   return e 
}
async function musicWorker(data){
    const results = await doWork(data)
    return results 
}
                module.exports = musicWorker;