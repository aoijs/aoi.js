const interpreter = require("../interpreter") 

module.exports = async (client, data, pulse) => {
    for (const command of (pulse ? client.timeout_pulse_commands.array() : client.timeout_commands.array())) {
        const channelID = command.channel ? command.channel.includes("$") ? await interpreter(client, {}, [], {
            code: command.channel, 
            channel: command.channel 
        }, undefined, true) || "" : command.channel : "" 
        
        const channel = client.channels.cache.get(channelID) 
        
        const d = {
            guild: client.guilds.cache.get(data.guildID) || (channel ? channel.guild : undefined), 
            author: client.user, 
            member: channel ? channel.guild.me : undefined, 
            channel
        }
        
        interpreter(client, d, [], command, undefined, false, undefined, {
            expiredData: data 
        })
    }
}