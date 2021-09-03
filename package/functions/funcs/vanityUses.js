module.exports = async d => {
    const code = d.command.code 
    
    const vanity = await d.message.guild.fetchVanityData().catch(err => null) 
    
    return {
        code:code.replaceLast(`$vanityUses`, vanity ? vanity.uses : "" )
    }
}