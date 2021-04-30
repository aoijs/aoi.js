const Discord = require("discord.js") 

const channels = new Discord.Collection() 

module.exports = (client, channel, user) => {
    if (channel.author) {
        return trigger(client, channel.channel, channel.author, "destroy")
    }
    trigger(client, channel, user, true)
}

function trigger(client, channel, user, first) {
    const data = channels.get(channel.id) || {} 
    
    if (first === "destroy") {
        clearTimeout(data[user.id])
        delete data[user.id] 
        channels.set(channel.id, data)
        return client.emit("typingStop", channel, user)
    }
    
    if (data[user.id] && first && user.typingIn(channel)) return undefined 
    
    if (user.typingIn(channel)) {
        data[user.id] = setTimeout(() => trigger(client, channel, user), 3000)
        channels.set(channel.id, data)
    } else {
        delete data[user.id] 
        channels.set(channel.id, data)
        client.emit("typingStop", channel, user) 
    }
}