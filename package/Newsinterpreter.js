//// Requiring Files 
const AoiError = require('./classes/AoiError.js');
const DefaultOptions = require('./Utils/helpers/customParser.js');
const Discord = require('discord.js');
const { Function,CustomFunction } = require('./classes/Functions.js');
const IF = require('./Utils/helpers/if.js');
const Util = require('./classes/Util.js');

const Interpreter = async ( client,discordData,args,command,db,returnCode = false, channelUsed,data = {}, useChannel,returnMessage, returnExecution,returnID,sendMessage=false ) => {
    ////defining discordDatas 
    const message = discordData.message || discordData;
    const { channel,author,member,mentions,guild } = discordData;
    //// defining Aoijs Terms 
    let timezone = "en-us",editIn,deleteIn,ErrorOccured,suppressError,error,msgObj,FuncData,returnData = {}; 
    //// Defining Message Data 
    let messageData = {
        embeds : [],
        components : [],
        reply : {},
        allowedMentions : {},
        stickers : []
    } 
   //// defining Data 
    const randoms  = data.randoms || {},
      vars = data.vars || {},
      array = data.array || [],
      arrays = data.arrays || [],
      object = data.object || {};
    //defining Main data;
    const { code } = command;
    const functions = command.functions || client.functionManager.findFunctions(code);
    const debug = {
        rawCode : code,
        functions,
    }
    //main part 
    const start = Date.now();
    if(client.aoiOptions.debugs?.interpreter) {
        console.time("interpreter"+start);
        debug.startedAt = start ;
    }
    
    let i = functions.length;
    while( i >= 0 ) {
        //if there was an error , break the loop
        if(error) break;
        //function 
        let func = functions[ i ]; 
        
        const regex = new RegExp("\\"+func.replace("[","\\["),"gi");
        code = code.replace(regex,func);
        
        FuncData = await client.functionManager.cache.get( func.replace("$","") ).code({
            timezone,
            messageData,
            data,
            utilData,
            error,
            suppressError,
            message,
            channel,
            author,
            guild,
            mentions,
            reactions,
            member,
            command : {
                name : command.name,
                code : code,
                error : command.error,
                functions : functions 
            },
            msg : message,
        });
        debug[ func ] = FuncData;
        
        code = FuncData?.code ?? code;
        if( FuncData?.data ) {
            data = data;
        } 
    } 
}

function unpack(code,func) {
            const last = code.split(func.replace("[","")).length - 1;
            const sliced = code.split(func.replace("[",""))[last];
            return sliced.after();
          };