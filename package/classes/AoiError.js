const {ComponentParser,EmbedParser,FileParser} = require('../Handler/parsers.js')
class AoiError {
/**
  *@params : none 
  *@note : should not be initialised using "new" 
  */
constructor(){
    const error = new Error(`Cannot Initialise "AoiError" Class`)
    error.name = "AoiError"
    throw error;
}
/**
  *@params (callback : callback that call this function )  (intent : intent that callback uses)
  *@type : (CallbackError)
  */
static CallbackError(callback,intent,line){
    const error = new Error(`(Missing Intents) : "${callback}" requires "${intent}" intent.`);
    error.name = "CallbackError";
    error.fileName = "./Bot.js"
    error.lineNumber = line
    throw error;
}
/**
  *@params (command: which called the error) (type: type of command Error (options : "name" & "code")) (name: name property of the command) (position: position of that command in the collection)
  *@type: (CommandNameError || CommandCodeError)
  */
static CommandError(command,type,name,position){
    if(type==="name"){
        const error = new Error(`"name" property is missing in "${command}" (position: ${position})`)
        error.name = "CommandNameError"
        throw error 
    }
    else if(type==="code"){
        const error = new Error(`"code" is not provided in "${name||"the Command"}" : ${command} (position: ${position})`)
        error.name = "CommandCodeError"
        throw error 
    }
}
/**
  *@params (client : Bot Class) (channelID : ID of the Channel Wherr this Error Would Be sent) (options:MessageOptions (content, embeds, components, allowedMentions,files)
  *@type : (CustomError)
  */
static async makeMessageError(client, channelID,options={}){
 if(options.embeds){
    options.embeds = await EmbedParser(options.embeds)
 }
 if(options.files){
     options.files = await FileParser(options.files)
 }
 if(options.components){
     options.components = await ComponentParser(options.componenents)
}

client.channels.cache.get(channelID).send(options)
}
  static consoleError(name,e){
       return console.error(`${name}: ${e}`)
   }
}
module.exports = AoiError;