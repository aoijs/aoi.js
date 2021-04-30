const inviteDeleteCommands = require("../handlers/inviteDeleteCommands") 

module.exports = (client, invite) => {
	if (client.options.fetchInvites) {
		const data = client.invites.get(invite.guild.id)
		
		delete data[invite.code]
		
		client.invites.set(invite.guild.id, data)
	}

  inviteDeleteCommands(client, invite)
}