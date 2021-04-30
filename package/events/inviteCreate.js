const inviteCreateCommands = require("../handlers/inviteCreateCommands") 

module.exports = (client, invite) => {
	if (client.options.fetchInvites) {
		const data = client.invites.get(invite.guild.id)
		
		data[invite.code] = invite.uses || 0
		
		client.invites.set(invite.guild.id, data)
	}

  inviteCreateCommands(client, invite)
}