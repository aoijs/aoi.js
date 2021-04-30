module.exports = async (client, reaction, user) => {

    return
    
    if (reaction.partial) {
        reaction = await reaction.fetch()
    }

    const item = await db.fetch(`reaction_role_${reaction.message.guild.id}_${reaction.message.id}_${reaction.emoji.toString()}`)
    
    if (!item) return 

    const member = await reaction.message.guild.members.fetch(user.id).catch(err => {})

    if (!member) return

    await member.roles.add(item.roleID).catch(err => {})
}