const Constants = require('../Utils/Constants.js')
const Discord = require("discord.js")
class Util {
   static constants = Constants 

   static async getUser(d,id){
       let user = d.client.users.cache.get(id) 
       if(!user){
           user = await this.fetchUser(d,id)
       }
       return user 
   }
   static async fetchUser(d,id){
       return await d.client.users.fetch(id).catch(err=>undefined)
   }
   static async fetchChannel(d,id){
       return d.client.channels.fetch(id).catch(e=>undefined)
   }
   static async getChannel(d,id){
       let channel = d.client.channels.cache.get(id)
       if(!channel) channel = await this.fetchChannel(d,id) 
       return channel 
   }
   static async fetchMember(guild,id){
       return await guild.members.fetch(id).catch(err=>undefined)
}
   static async fetchMembers(guild,options){
return await guild.members.fetch(options)
   }
   static async getMember(guild,id){
       let member = guild.members.cache.get(id) 
       if(!member) member = await this.fetchMember(guild,id)
       return member 
   }
   static async getMembers(guild, force=false,options={type:"startsWith",query:""}){
       let members ;
       if(!force){
       members = guild.members.cache.filter(x=>x.displayName?.toLowerCase()[options.type](options.query)) 
           }
       else{
          members = await this.fetchMembers(guild,options)
       }
       return members 
   }
   static async fetchMessage(channel,id){
       return await channel.messages.fetch(id).catch(err=>undefined)

   }
   static async getMessage(channel,id){
       let message = channel.messages.cache.get(id)
       if(!message) message = await this.fetchMessage(channel,id) 
       return message
   }
   static  setCode(options={}){
       return options.code.replaceLast(options.inside?`${options.function}${options.inside}`:`${options.function}`,options.result||"")
}
   static async getGuild(d,id){
       return d.client.guilds.cache.get(id)
   }
   static get channelTypes(){
       return {
           Text:"GUILD_TEXT",
           Dm:"DM",
           Voice:"GROUP_VOICE",
           GroupDm:"GROUP_DM",
           Category:"GUILD_CATEGORY",
           News:"GUILD_NEWS",
           Store:"GUILD_STORE",
           NewsThread:"GUILD_NEWS_THREAD",
           PublicThread:"GUILD_PUBLIC_THREAD",
           PrivateThread:"GUILD_PRIVATE_THREAD",
           Stage:"GUILD_STAGE_VOICE",
           Unknown:"UNKNOWN"
       }
   }

   static async errorParser(d,error){
       const parsers = require('../Handler/parsers.js')
       try {
           error = JSON.parse(error) 
           if(error.embeds?.includes("{newEmbed:")){
               error.embeds = await parsers.EmbedParser(error.embeds||"") 
           }
           if(error.components?.includes("{actionRow:")){
               error.components = await parsers.ComponentParser(error.components||"") 
           }
           if(error.embeds?.includes("{attachment:")|| error.embeds?.includes("{file:")){
               error.files = await parsers.FileParser(error.files||"") 
               console.log(error)
           }
       }
       catch(e){
           console.error(e)
      error = await parsers.ErrorHandler(d,error,true)
       } 
       return error;
   }
   }
module.exports = Util;