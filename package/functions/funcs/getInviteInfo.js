module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split("$getInviteInfo").length - 1
    
    const inside = code.split("$getInviteInfo")[r].after()

    const err = d.inside(inside);

    if (err) return d.error(err);
    
    const [c, option] = inside.splits
    
    const invites = await d.message.guild.fetchInvites().catch(err => null) 
    
    if (!invites) return d.error(`\`InviteError: Failed to fetch invites\``)
    
    const invite = invites.find(e => e.url === c || e.code === c) 
    
    if (!invite) return d.error(`\`${d.func}: Invalid invite code in ${inside}\``)
    
    const opt = {
        guildID: invite.guild.id, 
        uses: invite.uses, 
        userID: invite.inviter.id, 
        isTemporary: invite.temporary,
        createdAt: invite.createdTimestamp,
        expiresAt: invite.expiresTimestamp || "", 
        url: invite.url, 
        maxUses: invite.maxUses,
        channelID: invite.channel.id
    }[option]
    
    return {
        code: code.replaceLast(`$getInviteInfo${inside}`, opt)
    }
}