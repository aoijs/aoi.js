const ErrorParser = require("../../handlers/errorParser.js")
const axios = require('axios')
const {Collection} = require ('discord.js')
const {EventEmitter} = require('events') 
class CustomCollector extends EventEmitter {
constructor(msgid,userFilter,time,data,cmds,errorMessage="",client,command){
    super();
   
    this.msgid = msgid 
    this.filter = userFilter 
    this._timeout =time 
    this.data = data
    this.cmds = cmds
    this.errmsg = errorMessage
    this.mainData = []
    this.timeout = setTimeout
   this.endsOn = (Date.now() + Number(time));
   Object.defineProperty(this,"client",{value:client})
   }
 async start(msgid,user,checker,data){
   
     if(this.data.includes(checker) && this.endsOn >= Date.now() && this.msgid === msgid && (this.filter === "everyone" || this.filter === user)){
     
         this.mainData.push(data)
         this.emit("ItemFound",data)
     }
  this.timeout(()=>{
this.emit("CustomCollectorOff",this.mainData); 
delete this._timeout   
//this.off("ItemFound",this.listeners("ItemFound")[0])
    delete this._events.ItemFound 
},this._timeout)
   
    /* else{console.log(`no matching data found.
data : ${JSON.stringify(this.data)} 
checkef: ${checker}
endson : ${this.endsOn}
timeout: ${this._timeout}
ogmsgid : ${this.msgid}
msgid : ${msgid}
author: ${this.filter}
user: ${user},
errmsg:${JSON.stringify([this.errmsg[0],ErrorParser(this.errmsg[1]),this.errmsg[2]])}
`)
          }*/
 if(this.filter !== "everyone" && this.filter !== user && this.errmsg !== [] && this.endsOn > Date.now()){
     //console.log([ErrorParser(this.errmsg[1])])
axios.post(this.client._api(`/interactions/${data.id}/${data.token}/callback`),{
    type:4,
    data:{
    content:this.errmsg[0] || "",
    embeds:(this.errmsg[1] !== "" || this.errmsg[1]) ? [JSON.parse(JSON.stringify(ErrorParser(this.errmsg[1])).replace(/#COMMA#/g,","))] : [],
    flags: this.errmsg[2] !== "" ? Number(this.errmsg[2]): 0
}
    },{
    headers:{
        Authorization:`Bot ${this.client.token}`
    }
}).catch(err=>{})
}
}    
    }
module.exports = CustomCollector;
