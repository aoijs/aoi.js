//class that djs doesn't have so we create it ourselves 
const Discord = require("discord.js") 
const axios = require("axios") 

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
        
        this.command = {
            id: data.data.id,
            name: data.data.name,
            description: data.data.description
        }
        
        this.options = data.data.options
    }
    
    reply(content, embed) {
        try {
        axios.post(this.client._api(`/interactions/${this.id}/${this.token}/callback`), {
            type: 4,
            data: {
                content: typeof content === "string" ? content : "", 
                embeds: embed ? Array.isArray(embed) ? embed : [embed] : [] 
            }
        }) 
       .then(res => "successful").catch(e => console.log(e.message))
        } catch (e) {
            console.log(e.message)
        }
    }
    
    async delete() {
        const req = await axios.delete
    }
}

module.exports =Interaction