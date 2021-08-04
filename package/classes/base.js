const Discord = require("discord.js");
const dbddb = require('dbdjs.db')
const AoiError = require('./AoiError.js')
const {ActivityTypeAvailables,IntentOptions,SlashOptionTypes} = require('../Utils/Constants.js')
const { Database,Promisify}= require('./Database.js')
const CacheManager = require('./CacheManager.js')
class BaseClient extends Discord.Client {
 constructor(options){
     if(options.cache){
         options.makeCache = CacheManager._setDjsCacheManagers(options.cache)
     }
 if(options.presence?.activites?.length){
     if(Object.keys(ActivityTypeAvailables).includes(options.presence?.activities[0].type) || Object.values(ActivityTypeAvailables).includes(options.presence?.activities[0].type)){
         options.presence.activities[0].type = ActivityTypeAvailables[options.presence?.activities[0].type]||options.presence?.activities[0].type
     }
     else{
   throw new TypeError(`ActivityTypeAvailablesError:  Invalid Activity Type (${options.presence?.activities[0].type}) Provided`)
     }
 }
 options.partials = options.partials||["CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER", "REACTION"]
   options.intents = !Array.isArray(options.intents) ?(options.intents?.toLowerCase() === "all"?IntentOptions.all : undefined):options.intents.map(x=>IntentOptions[x]||x)
      super (options);
     this.cacheManager = new CacheManager(this)
     if(!options?.database?.db || options?.database?.db === "default"){
this.db = new Database({
path:options?.database?.path||"./database/",
tables: options?.database?.tables||["main"]
})
        this.db.connect()
     }
 else if(options?.database?.promisify && options?.database?.db){
this.db = new Promisify(options?.database?.db)
     this.db.createTable(options?.database?.tables||["main"])
 }
 else if(options?.database?.db &&!options?.database?.promisify){
     this.db = options?.database?.db 
 }
this.variables = new Discord.Collection()
if(options?.events?.music){
    
}
if(options?.events?.functionError){
    this.on("functionError",async (data,client)=>{})
}
if(options?.events?.timeout){
    
}
      this.prefix = options.prefix
     Object.defineProperty(this,"statuses",{value: new Discord.Collection()})
      if(options.mobilePlatform === true){
this.options.ws.properties.$browser = "Discord Android"
      }
     this.on("ready",()=>{require('../Handler/status.js')(this.statuses,this);
  if(options?.fetchInvites?.enabled){
      require('../Handler/fetchInvites.js')(this)
  }
        })
     this._api = (url) =>`https://discord.com/api/v9/${url.startsWith("/") ? url.slice(1) : url}`
      this.login(options.token)

       }
 status(...statuses){

 for(const status of statuses){
  status.type = (Object.keys(ActivityTypeAvailables).includes(status.type) || Object.values(ActivityTypeAvailables).includes(status.type)) ? (ActivityTypeAvailables[status.type]||status.type ): "PLAYING"
 const option = {name:status.text,type:status.type}
 if(status.url){option.url=status.url}
 this.statuses.set(this.statuses.size,{
status:status.status||"online",
time:isNaN(status.time || 12)?12:status.time,
activity:option,
afk:status.afk||false,
shardID:status.shardIDs||0
})
 }
    }
 variables(d={}){
  for(const [key,value] of Object.entries(d)){
      this.variables.set(key,value)
  }
 }
async _createCacheFactory(options){
    options.makeCache =await CacheManager._setDjsCacheManagers(options.cache) 
}
async createSlashCommandData(d={}){
    if(!d.data.name){
        AoiError.consoleError("createSlashCommandDataError",'"name" property is not present')
    }
    if(!d.data.description){ AoiError.consoleError("createSlashCommandDataError",'"description" property is not present') }
    try{
   d.data.options = d.data.options?.map((x,y,z)=>{
x.type = SlashOptionTypes[x.type]||x.type
return z[y]
       })

        this.application.commands.create(d.data,d.guildId).then(x=>console.log(x))
    }
    catch(e){
        AoiError.consoleError("createSlashCommandData",e)
    }
}
}
module.exports = BaseClient;