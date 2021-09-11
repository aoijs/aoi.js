const IF = require('./Utils/helpers/if.js')
const Discord = require('discord.js');
const {Function,CustomFunction} = require('./classes/Functions.js') 
const AoiError = require('./classes/AoiError.js')
const Util = require('./classes/Util.js')
const Interpreter =async (client,message,args,command,db,returnCode = false, channelUsed,data = {}, useChannel,returnMessage, returnExecution,returnID,sendMessage=false)=>{
    try{
  //defining vars// 
    let code = command.code?.replace(/\\]/g,"#LEFT#").split("\\[").join("#RIGHT#").replace("\\,","#COMMA#")
    const oldcode = code 
  let [randoms,timezone,letVars,object,disableMentions,array,reactions,channel,author,guild,mentions,member,msg]= [{},"UTC",data.vars||{},data.object || {},["roles","users","everyone"],data.array ||[],[],message.channel,message.author,message.guild,message.mentions,message.member,message];
  let anErrorOccuredPlsWait;
  let embeds ;
  let deleteIn;
  let suppressErrors;
  let editIn;
  let error;
  let attachments ;
  let components =[] 
  let reply; 
  let allowedMentions ={} 
  let FuncData;
  let msgobj;
  let returnData = {}
  const funcs = command.functions?.length ? command.functions : client.functionManager.findFunctions(command.code)
  //debug system 
    if(client?.aoiOptions?.debugs?.interpreter){
    console.log("|------------------------------------------|")
    console.log("Raw Code:"+(code))
 console.time("exact interpreter time")
        console.log("Functions Found:"+funcs)
        }
        console.log(error)
        const start = Date.now() 
  //parsing functions (dont touch) 
 for(let i = funcs.length;i>0;i--){ 
     if(!funcs.length) break;

     if((i > funcs.length) && (funcs.length !== 0)) i = funcs.length 
     let func = funcs[i-1] 

   if(error) break;
     const regex = new RegExp ("\\"+func.replace("[","\\["),"gi") 

    code = code.replace(regex,func) 
     console.log(func)
   if(func === "$endif"){
       try{
       const endifIndex = funcs.indexOf("$endif") 
       const ifIndex = funcs.indexOf("$if")
       const {ifcode,replacer} = await IF({
    randoms:randoms,
    command:{
        name: command.name,
        code:code,
        error:command.error,
        async:command.async || false ,
        functions:command.functions || client.functionManager.findFunctions(command.code)
        },
    args:args,
    aoiError:require('./classes/AoiError.js'),
    data:data,
    func:func,
    util:Util,
    allowedMentions: allowedMentions,
    embeds:embeds||[],
    components: components,
    files:attachments||[],     
    timezone:timezone,   
    channelUsed:channelUsed,
    vars:letVars,
    object:object,
    disableMentions:disableMentions,
    array:array,
    reactions:reactions,
    message:message,
    msg:msg,
    author:author,
    guild:guild,
    channel:channel,
    member:member,
    mentions:mentions,
   unpack() {
            const last = code.split(func.replace("[","")).length - 1;
            const sliced = code.split(func.replace("[",""))[last];

            return sliced.after();
          },
    inside(unpacked) {
if (typeof unpacked.inside !== "string"){
    if(suppressErrors) return suppressErrors
   else{ const e = client.options.suppressAllErrors ? client.options.errorMessage : ` \`${func}: Invalid Usage\` `
    return e 
        }
    }
     else return false 
          },
    noop() {},
  async  error(err){
      client.emit("functionError",{error:err?.addBrackets(),function:func,command:command.name,channel,guild},client)
if(client.options.suppressAllErrors){
    if(client.options.errorMessage){
        const {ErrorHandler,EmbedParser,FileParser, ComponentParser} = require('./Handler/parsers.js')
        
     if(!message || !message.channel){
console.error(client.options.errorMessage.addBrackets())
     }
     else{
         let [con,em, com,fil] = [" ", "","",""]
 let isArray = Array.isArray(client.options.errorMessage)
 if(isArray){
isArray = client.options.errorMessage
con = (isArray[0] === "" || !isArray[0])? " " : isArray[0] 
em =isArray[1] !== "" && isArray[1]? await EmbedParser(isArray[1]||""):[] 
fil= isArray[3] !== "" && isArray[3]? await FileParser(isArray[3]||""):[] 
com= isArray[2] !== "" && isArray[2] ? await ComponentParser(isArray[2]||""): []
 }
         else{
             con = client.options.errorMessage.addBrackets() === ""? " " : client.options.errorMessage.addBrackets()
   
         }
         
if(!anErrorOccuredPlsWait){message.channel.send({content: con,embeds:em||[], components: com||[],files:fil||[]})}
         anErrorOccuredPlsWait = true 
    }
}
    else return ;
    }
else{
    anErrorOccuredPlsWait = true 
if(!message || !message.channel){
    console.error(err.addBrackets())
}
 if(suppressErrors){
ErrorHandler({channel:channel,message:message,guild:guild,author:author}, suppressErrors?.split("{error}").join(err.addBrackets()))
 }
 else{
 message.channel.send(typeof err === "object" ? err : err?.addBrackets())
 }
    }
          },
    interpreter:Interpreter,
    client:client,
    embed:new Discord.MessageEmbed()
      }) 
       console.log("ifcode:"+ifcode)
       FuncData = await client.functionManager.interpreter(client,message,args,{name:"name",code:ifcode,functions:client.functionManager.findFunctions(ifcode)},client.db,true, undefined,data, undefined, undefined,true)
       funcs.splice(ifIndex,funcs.length-ifIndex+1) 

           

code = code?.replaceLast(replacer,FuncData?.code) 
       FuncData.code = code 
        
   
           } catch(e){
               console.error(e)
           }
   }
      else{
     try{ 
  const functionObj = client.functionManager.cache.get(func.replace("$","").replace("[","")) 
  if(functionObj instanceof CustomFunction && functionObj.type === "aoi.js"){ 
     const d ={}
     Object.assign(d,functionObj)
  try{
      for(let p = functionObj.params.length-1;p>=0;p--){
     d.code =  d.code.replace(`{${functionObj.params[p]}}`,unpack(code,func).splits[p])
          }
      FuncData = await client.functionManager.interpreter(client, message,args,d,client.db,true)

          
  }
      catch(e){console.error(e)}
      }
       else {
           try {
     FuncData =client.functionManager.cache.get(func.replace("$","").replace("[",""))?.code({
    randoms:randoms,
    command:{
        name: command.name,
        code:code,
        error:command.error,
        async:command.async || false ,
        functions:command.functions 
        },
    args:args,
    aoiError:require('./classes/AoiError.js'),
    data:data,
    func:func,
    util:Util,
    allowedMentions: allowedMentions,
    embeds:embeds||[],
    components: components,
    files:attachments||[],     
    timezone:timezone,   
    channelUsed:channelUsed,
    vars:letVars,
    object:object,
    disableMentions:disableMentions,
    array:array,
    reactions:reactions,
    message:message,
    msg:msg,
    author:author,
    guild:guild,
    channel:channel,
    member:member,
    mentions:mentions,
   unpack() {
            const last = code.split(func.replace("[","")).length - 1;
            const sliced = code.split(func.replace("[",""))[last];

            return sliced.after();
          },
    inside(unpacked) {
if (typeof unpacked.inside !== "string"){
    if(suppressErrors) return suppressErrors
   else{ const e = client.options.suppressAllErrors ? client.options.errorMessage : ` \`${func}: Invalid Usage\` `
    return e 
        }
    }
     else return false 
          },
    noop() {},
  async  error(err){
      client.emit("functionError",{error:err?.addBrackets(),function:func,command:command.name,channel,guild},client)
if(client.options.suppressAllErrors){
    if(client.options.errorMessage){
        const {ErrorHandler,EmbedParser,FileParser, ComponentParser} = require('./Handler/parsers.js')
        
     if(!message || !message.channel){
console.error(client.options.errorMessage.addBrackets())
     }
     else{
         let [con,em, com,fil] = [" ", "","",""]
 let isArray = Array.isArray(client.options.errorMessage)
 if(isArray){
isArray = client.options.errorMessage
con = (isArray[0] === "" || !isArray[0])? " " : isArray[0] 
em =isArray[1] !== "" && isArray[1]? await EmbedParser(isArray[1]||""):[] 
fil= isArray[3] !== "" && isArray[3]? await FileParser(isArray[3]||""):[] 
com= isArray[2] !== "" && isArray[2] ? await ComponentParser(isArray[2]||""): []
 }
         else{
             con = client.options.errorMessage.addBrackets() === ""? " " : client.options.errorMessage.addBrackets()
   
         }
         
if(!anErrorOccuredPlsWait){message.channel.send({content: con,embeds:em||[], components: com||[],files:fil||[]})}
         anErrorOccuredPlsWait = true 
    }
}
    else return ;
    }
else{
    anErrorOccuredPlsWait = true 
if(!message || !message.channel){
    console.error(err.addBrackets())
}
 if(suppressErrors){
ErrorHandler({channel:channel,message:message,guild:guild,author:author}, suppressErrors?.split("{error}").join(err.addBrackets()))
 }
 else{


message.channel.send(typeof err === "object" ? err : err?.addBrackets())
          }
    }
      },
    interpreter:Interpreter,
    client:client,
    embed:new Discord.MessageEmbed()
    })
               }
           catch(e){console.error(e)}
           }
         }
     catch(err){
             console.error(err)
}
         }
   FuncData = await FuncData 
  if(FuncData?.code){code = FuncData.code}
  if(FuncData?.randoms){randoms = FuncData.randoms}
  if (FuncData?.data){ data = FuncData.data 
           array =  FuncData.data?.array || array 
           object = FuncData?.data?.object || object 
           letVars =  FuncData?.data?.vars || letVars 
                   }
  if(FuncData?.timezone){timezone = FuncData.timezone}   
  if(FuncData?. allowedMentions){allowedMentions = FuncData.allowedMentions }
  if(FuncData?.embeds){embeds = FuncData.embeds}
  if(FuncData?.reactions){reactions = FuncData.reactions} 
  if(FuncData?.disableMentions){disableMentions = FuncData.disableMentions}
  if(FuncData?.editIn){editIn = FuncData.editIn} 
  if(FuncData?.files){attachments=FuncData.files}
  if(client.options.suppressAllErrors || FuncData?.suppressErrors){suppressErrors = client.options.suppressAllErrors || FuncData?.suppressErrors}
  if(FuncData?.components){components = FuncData.components}
  if(FuncData?.reply){reply = FuncData.reply }
  if(FuncData?.useChannel){useChannel = FuncData.useChannel}
  if(FuncData?.returnID){returnID = FuncData?.returnID}
  if(FuncData?.error){error = FuncData?.error}
if(client?.aoiOptions?.debugs?.interpreter){    
console.log(func+":"+require('util').inspect(FuncData,{depth:0}))
    }
     } 
      console.log(code)
    embeds = JSON.parse(JSON.stringify(embeds||[])?.replaceAll("$executionTime",Date.now()-start))
    code = code?.replace(/\$executiontime/gi,(Date.now()-start))
    if(client?.aoiOptions?.debugs?.interpreter){
    console.timeEnd("exact interpreter time")
    console.log("executionTime™:"+(Date.now()-start)+"ms")
 }
       code = code.trim()     
    if(embeds?.some(x=>x=== undefined)) {
        return AoiError.consoleError("EmbedError","Some Indexes Are Empty")
               error=true   
                                       }
    if(returnCode){returnData.code = code}
        if(returnExecution){ returnData.data =data}
    if((code.length || embeds?.length) && !anErrorOccuredPlsWait && !error ){
        try{
            console.log(components)
  const send = {
      embeds:embeds,
      files: attachments,
      components: components,
      allowedMentions:{parse: disableMentions,repliedUser:reply?.user|| false},
      referenceMessage:reply?.message||{}
  }
  if(code.trim() !== ""){send.content = (code.addBrackets() === "" ? " " : code.addBrackets())}
            if(returnCode && !sendMessage){} 
            else{
    if(!useChannel){
   msgobj = await message.channel.send(
    send
)
        }
    else{
      msgobj = await useChannel.send(send)
    }
                }
    if(client?.aoiOptions?.debugs?.interpreter){
   console.log("Final Code:"+code.addBrackets())

  console.log("|------------------------------------------|")     
        }
if(reactions?.length){
  const react = setInterval(()=>{const r = reactions.shift() 
  msgobj.react(r)
    if(!reactions.length){clearInterval(react)} 
  },1500)
}
if(editIn?.length){
    const ee = setInterval(()=>{const m = editIn.msgs 
    msgobj.edit(m.shift())
         if(!m.length){ClearInterval(ee)}
  }, editIn.time)
}
if(deleteIn){
setTimeout(()=>msgobj.delete(),deleteIn)
}

if(returnID){returnData.id= msgobj?.id} 
if(returnMessage){returnData.message = msgobj }    


        
}
catch (e) {
    console.error(e) 
}
        } 
        return Object.keys(returnData).length ? returnData : undefined 
}
        
catch (e){
    console.error(e) 
}
    }
module.exports = Interpreter
    function unpack(code,func) {

            const last = code.split(func.replace("[","")).length - 1;

            const sliced = code.split(func.replace("[",""))[last];

            return sliced.after();

          };
