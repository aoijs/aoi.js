const interpreter = require("../interpreter") 

module.exports = (client, command) => {
    async function execute() {
		if (!client.readyAt) await new Promise(res => {
			client.once('ready', res)

			if (client.readyAt) res()

			setTimeout(() => { if (client.readyAt) res() }, 50)
		})

        const id = command.channel && command.channel.includes("$") ? await interpreter(client, {}, [], {
            code: command.channel, 
            name: command.channel
        }, undefined, true) : command.channel 
        
        const channel = client.channels.cache.get(id) 
        
        const data = {
            author: client.user, 
            member: channel ? channel.guild.me : undefined, 
            channel, 
            guild: channel ? channel.guild : undefined 
        }
        
        await interpreter(client, data, [], {
            name: command.channel,
            code: command.code 
        })
    }
    
    if (command.executeOnStartup) execute() 
    
    const interval = setInterval(() => execute(), command.every)

	return interval
}

