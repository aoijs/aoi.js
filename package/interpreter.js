const fs = require('fs') 
const location = "./functions/"
const Functions = Object.keys(require(location+"parser.js"))
const Discord = require('discord.js');
const {ErrorHandler,EmbedParser,FileParser, ComponentParser} = require('./Handler/parsers.js')
const Interpreter =async (client,message,args,command,db,returnCode = false, channelUsed,data = {},useChannel,returnMessage, returnExecution,returnID)=>{
    let code = command.code.replace(/\\]/g,"#LEFT#").split("\\[").join("#RIGHT#").replace("\\,","#COMMA#")
    const oldcode = code 
  let [randoms,timezone,letVars,object,disableMentions,array,reactions,channel,author,guild,mentions,member,msg]= [{},"UTC",{},data.object || {},["roles","users","everyone"],data.array ||[],[],message.channel,message.author,message.guild,message.mentions,message.member,message];
  let anErrorOccuredPlsWait;
  let embeds;
  let deleteIn;
  let suppressErrors;
  let editIn;
  let attachments;
  let components;
  let reply; 
  let FuncData;
  let msgobj;
    if(client?.aoiOptions?.debugs?.interpreter){
    console.log("|------------------------------------------|")
    console.log("Raw Code:"+(code))
}
    let customFuncs = [] 
    
    let funcs = [] 
    let loadsOfFunc = Functions.filter(thatfunc =>code.toLowerCase().includes(thatfunc.toLowerCase()))

    const funcyboys = code.split("$")
if(client?.aoiOptions?.debugs?.interpreter){
 console.time("exact interpreter time")
    }
    const start = Date.now()
  for(const funcboy of funcyboys.reverse()){
    let Func = loadsOfFunc.filter(f=>(f).toLowerCase() === ("$"+funcboy.toLowerCase()).slice(0,f.length))
     
 if(!Func.length){continue;}
 if(Func.length === 1){funcs.push(Func[0])}
 else if(Func.length > 1){
   funcs.push(Func.sort((a,b)=>b.length - a.length)[0])
     }
 }
    if(client?.aoiOptions?.debugs?.interpreter){
        console.log("Functions Found:"+funcs)
        }
 for(const func of funcs){
     const regex = new RegExp ("\\"+func.replace("[","\\["),"gi") 
  code = code.replace(regex,func)   
   try{ 
     FuncData = await require(location+"funcs/"+func.replace("$","").replace("[","")+".js")({
    randoms:randoms,
    command:{
        name: command.name,
        code:code,
        error:command.error,
        async:command.async || false ,
        },
    args:args,
    func:func,
    timezone:timezone,   
    channelUsed:channelUsed,
    vars:letVars,
    object:object,
    disableMentions:disableMentions,
    array:array,
    reactions:[],
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
      
if(client.options.suppressAllErrors){
    if(client.options.errorMessage){
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
 message.channel.send(err?.addBrackets())
 }
    }
          },
    interpreter:Interpreter,
    client:client,
    embed:new Discord.MessageEmbed()
    })
         }catch(err){console.error(err)
                    FuncData= {}}
    if(FuncData?.code){code = FuncData.code}
if(FuncData?.randoms){randoms = FuncData.randoms}

 if(FuncData?.timezone){timezone = FuncData.timezone}   
    if(FuncData?.embeds){embeds = FuncData.embeds||[]}
 if(FuncData?.reactions){reactions = FuncData.reactions}
     if(FuncData?.disableMentions){disableMentions = FuncData.disableMentions}
     if(FuncData?.editIn){editIn = FuncData.editIn} 
     if(FuncData?.attachments){attachments=FuncData.attachments||[]}
     if(client.options.suppressAllErrors || FuncData?.suppressErrors){suppressErrors = client.options.suppressAllErrors || FuncData?.suppressErrors}
     if(FuncData?.components){components = FuncData.components||[]}
     if(FuncData?.reply){reply = FuncData.reply }
     if(FuncData?.useChannel){useChannel = FuncData.useChannel}
     if(FuncData?.returnID){
         returnID = FuncData.returnID 
     }
 if(client?.aoiOptions?.debugs?.interpreter){    
console.log(func+":"+require('util').inspect(FuncData))
     }
 }
    code = code.replace(/\$executiontime/gi,(Date.now()-start))
    if(client?.aoiOptions?.debugs?.interpreter){
    console.timeEnd("exact interpreter time")

console.log("executionTime™:"+(Date.now()-start)+"ms")
 }
code = code.trim()     
 if(returnCode) return code;
    if(code.length && !anErrorOccuredPlsWait){
  const send = {
      embeds:embeds,
      files: attachments,
      components: components,
      allowedMentions:{parse: disableMentions,repliedUser:reply?.user|| false},
      referenceMessage:reply?.message||{}
  }
  if(code !== ""){send.content = code.addBrackets()}
    if(!useChannel){
   msgobj = await message.channel.send(
    send
)
        }
    else{
      msgobj = await useChannel.send(send)
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

if(returnID){return msgobj?.id} 
    

if(returnExecution){ return (object,data, array,letVars)}
 }
}

module.exports = Interpreter