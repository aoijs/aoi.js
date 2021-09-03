const fs = require("fs") 
const functions = require("./functions/parser.js")
const Discord = require("discord.js")
const embedE = require("./handlers/errors.js")

const interpreter = async (client, message, args, command, db, returnCode = false, channelUsed, data = {}) => {

let code = command.code
  
code = code.split("\\]").join("#LEFT#").split("\\$").join("#CHAR#").split("\\;").join("#COLON#")
  
if (command.ignoreEscapes) {
  code = code.split("#LEFT#").join("\\]").split("#CHAR#").join("\\$")
}
  
let randoms = {}, embed = new Discord.MessageEmbed(), deleteIn, object, suppressErrors, editIn, array = [], attachment, reactions = [], channel = message.channel, timezone = 'UTC'

const restFunctions = Object.keys(functions).filter(func => code.toLowerCase().includes(func.toLowerCase()))

//insensitive interpreter ™ 
for (const func of restFunctions) {
    //don't touch 
    const regex = new RegExp("\\" + func.replace("[", "\\["), "gi") 
    
    code = code.replace(regex, func)
}

const funcs = code.split("$")

let start = Date.now() 
  
  for (const func of funcs.reverse()) {
      
    const FUNC = `$${func}`
    
    let F = restFunctions.filter(f => f === FUNC.slice(0, f.length))
    
    //incase only one function was found, exit directly
    if (F.length === 1) F = F[0] 
    //if multiple matches found, we have to filter until we find the right function 
    if (typeof F === "object" && F.length > 1) {
        const maxIndex = F.sort((x, y) => y.length - x.length)[0].length 
        
        const option = FUNC.slice(0, maxIndex) 
        
        F = F.find(f => f === option)
    }
    
    if (!F || F.length === 0) {} else 
    if (F) {
        //ugly attempt to catch interpreter errors 
        try { 
            
        var EXECUTION = await require(`./functions/funcs/${F.replace("$", "").replace("[", "")}.js`)({
          command: {
          name: command.name,
          code: code, 
          error: command.error, 
          asynchronous: command.asynchronous 
        }, 
        _api: (url) => `https://discord.com/api/v8/${url.startsWith("/") ? url.slice(1) : url}`, 
        data: data, 
        timezone:timezone,
        object: object,
        embed: embed, 
        channelUsed: channelUsed,
        args: args, 
        client: client, 
        array: array, 
        reaction: message.reaction,
        message: message,
        randoms: randoms, 
        error: (err) => {
            if (!message || !message.channel) {
                return console.log(err.addBrackets())
            }
          if (suppressErrors !== undefined) {
            embedE({
              message: message, 
              interpreter: interpreter, 
              client: client
            }, suppressErrors.split("{error}").join(err)) 
         } else {
            try {
            	message.channel.send(err.addBrackets() + ` at line ${code.split("\n").findIndex(c => c.includes(err.split("$")[1].split("[")[0])) + 1 || "unknown"}`)
            } catch(e) {
              message.channel.send(err.addBrackets())
            } 
          }
        },
        channel: message.channel,
        interpreter: interpreter
      }) 
      } catch (error) {
          if (typeof command.error === "string") {
              try {
              interpreter(client, message, args, {
                  name: "ERR", 
                  code: command.error
              }, undefined, undefined, undefined, {
                  error: error
              })
              } catch {
                  return console.error(error)
              }
          } else {
              console.error(error)
          }
          
          return undefined 
      }
    
      if (typeof EXECUTION === "object") {
        code = EXECUTION.code
        if (EXECUTION.embed) {
          embed = EXECUTION.embed
        } //dbd.js server
        if (EXECUTION.deleteIn) {
          deleteIn = EXECUTION.deleteIn
        }
        if (EXECUTION.object) {
          object = EXECUTION.object
        }
        if (EXECUTION.suppressErrors !== undefined) {
          suppressErrors = EXECUTION.suppressErrors
        }
        if (EXECUTION.channel) {
          channel = EXECUTION.channel
        } 
        if (EXECUTION.reactions){
          reactions = EXECUTION.reactions
        }
        if (EXECUTION.randoms){
          randoms = EXECUTION.randoms
        }
        if (EXECUTION.editIn) {
          editIn = EXECUTION.editIn
        }
        if (EXECUTION.array) {
          array = EXECUTION.array
        } 
        if (EXECUTION.attachment) {
          attachment = EXECUTION.attachment
        }
      } else return 
    } 
  } 
  
  if (typeof code === "string") {
      code = code.replace(/\$executionTime/g, Date.now() - start)
  }
  
  if (returnCode) return code

  if (channel) {
   
    let send = true
    
    if (!embed.length && !embed.thumbnail && !embed.image) send = false
    
    const msg = await channel.send(code ? code.addBrackets() : "", send ? embed : attachment ? attachment : undefined).catch(err => {})
    
    if (msg) {
     
      if (reactions.length) {
        for (const reaction of reactions) {
         
          const react = await msg.react(reaction).catch(err => {})
          
          if (!react) msg.channel.send(`❌ Failed to add '${reaction}' reaction `)
          
        }
      } 

      if (editIn) {
        const edit = setInterval(async () => {
          const m = await embedE({}, editIn.fields[0].addBrackets(), true)

          msg.edit(m.message, m.embed)
          editIn.fields.shift()
          if (!editIn.fields.length) return clearInterval(edit)
        }, editIn.time) 
      }

      if (deleteIn) {
        msg.delete({
          timeout: deleteIn
        })
      }
    } 
  } 
}

module.exports = interpreter 