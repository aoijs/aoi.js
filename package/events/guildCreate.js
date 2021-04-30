const botJoinCommands = require("../handlers/botJoinCommands")
const { Collection } = require('discord.js')

module.exports = async (client, guild) => {
	if (client.options.fetchInvites) {
		const data = { }
		const invites = (await guild.fetchInvites().catch(err => { }) || new Collection()).array()

		let i = 0

		while (i < invites.length) {
			data[invites[i].code] = invites[i].uses || 0

			i++
		}

		client.invites.set(guild.id, data)
	}

  botJoinCommands(client, guild)
}