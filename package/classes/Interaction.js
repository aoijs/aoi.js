const Discord = require("discord.js") 
const axios = require("axios") 
const Snowflake = Discord.SnowflakeUtil 
class Interaction {
    constructor(client, data) {
        this.client = client 
        
        this._resolve(data)
    }
    
    _resolve(data) {
        this.channel = this.client.channels.cache.get(data.channel_id) 
        
        this.guild = this.client.guilds.cache.get(data.guild_id) 
        
        this.member = new Discord.GuildMember(this.client, data.member, this.guild)
        
        this.author = new Discord.User(this.client, this.member.user)
        
        this.token = data.token
       
        this.id = data.id
        
        this.type = data.type 
      if(this.type === 2){
        this.command = {
            id: data.data.id,
            name: data.data.name,
            description: data.data.description
            }
          this.options = data.data.options
          }
        if(this.type === 3){
            this.button = {
            customID : data.data.custom_id,
            componentType : data.data.component_type 
            }
            
                this.message = new Discord.Message(this.client,data.message,this.channel) 
            }
        
       
        
 //console.log(this)
// console.log(data)
        
    }
  
    reply(content,embed, components,flags,type) {     
    if(this.type === 2){
        try {
      var check;
    let c;      if(this.client.aoi.options.applicationCache){

   c = this.client.applications.slash.find(x=>x.id == this.command.id) 
/*console.log("cache")
        console.log(c)*/
      if(!c){
setTimeout(async()=>{
         let d = await axios.get(this.client._api(`applications/${this.client.user.id}/guilds/${this.guild.id}/commands`),{

              headers:{

                  Authorization:`Bot ${this.client.token}`

                  }

              })

        

             d = d.data 

             d = d.find(x=>x.id == this.command.id)

             if(d){c = { 

                 id: d.id,

                 name: d.name,

                 version: d.version,

                 description: d.description ,

                 options : d.options || [] ,

                 application : this.client,

                 guild: this.client.guilds.cache.get(d.guild_id) || null ,

                 timestamp: Snowflake.deconstruct(d.id).timestamp,

                 createdAt: Snowflake.deconstruct(d.id).date 
                 }
check  = "defined";
                   this.client.applications.slash.set(c.id,c)
                 }else{c = undefined ;
                       check = undefined}

                  /*console.log("guild")
    console.log(d)*/
},1000)
         }

      

      if(!check){
setTimeout(async()=>{
         let d= await axios.get(this.client._api(`applications/${this.client.user.id}/commands`),{

              headers:{

                  Authorization:`Bot ${this.client.token}`

                  }

              })

        

             d = d.data 

d = d.find(x=>x.name.toLowerCase() == this.command.name.toLowerCase())
   // console.log(d)

             if(d){c = { 

                 id: d.id,

                 name: d.name,

                 version: d.version,

                 description: d.description ,

                 options : d.options || [] ,

                 application : this.client,

                 guild: null ,

                 timestamp: Snowflake.deconstruct(d.id).timestamp,

                 createdAt: Snowflake.deconstruct(d.id).date 

                 }
                   this.client.applications.slash.set(c.id,c)
}else{c = undefined}
                  

         },2000)

      }

      
        }

        
           //console.log(this.command)
            axios.post(this.client._api(`/interactions/${this.id}/${this.token}/callback`), {
     
            type: type,
            data: {
                content: typeof content == "string" ? content : "", 
                embeds: embed ? Array.isArray(embed) ? embed : [embed] : [],
               
             
                flags: flags
            }
                
        }) 
            
            
            
       .then(res =>"successful").catch(e => {console.log(e.message)})
        } catch (e) {
            console.log(e.message)
        }
            }
        else{
      try {
          axios.post(this.client._api(`/interactions/${this.id}/${this.token}/callback`), {
     
            type: type,
            data: {
                content: typeof content == "string" ? content : "", 
                embeds: embed ? Array.isArray(embed) ? embed : [embed] : [],
                components: typeof components === "object" ? Array.isArray(components) ? components : [components] : [] ,
                flags: flags
            }
                
        }) 
            
            
            
       .then(res =>"successful").catch(e => {console.log(e.message)})
        } catch (e) {
            console.log(e.message)
        }
        }
    }
    
   async delete() {
        const req = await axios.delete
    }
  async get(){
      const e = await axios.get(this.client._api(`webhooks/${this.client.user.id}/${this.token}/messages/@original`),{
          headers:{
              Authorization:`Bot ${this.client.token}`
              }
      })
      return e.data 
  }
 async  edit(content,embed, components){
      const e = await axios.patch(this.client._api(`webhooks/${this.client.user.id}/${this.token}/messages/@original`),{
         

                content: typeof content == "string" ? content : "", 

                embeds: embed ? Array.isArray(embed) ? embed : [embed] : [],

              components: components 

              

            }
      ,{
          headers:{
              Authorization:`Bot ${this.client.token}`
              }
      }).catch(e=>console.log(e.message))
     
 }
 async deleteResponse(){
      const e = await axios.delete(this.client._api(`webhooks/${this.client.user.id}/${this.token}/messages/@original`),{
          headers:{
              Authorization:`Bot ${this.client.token}`
              }
      })
 }
}

module.exports =Interaction
