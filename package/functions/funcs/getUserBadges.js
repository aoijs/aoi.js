module.exports = async (d) => {
  try {
    const code = d.command.code
  
    const r = code.split("$getUserBadges").length - 1
    
    const after = code.split("$getUserBadges")[r].after()
    
    if (after.inside) {
      const id = after.inside
      
      const user = await d.client.users.fetch(id, false).catch(err => null)
      
      if (!user) return d.message.channel.send(`\`${d.func}: Invalid user ID in ${after}\``)
      
      if (!user.flags) await user.fetchFlags().catch(err => null) 
      
      const flags = user.flags.toArray()
      
      const custom = user.presence.activities.find(c => c.type === "CUSTOM_STATUS") 
      
      if (user.displayAvatarURL({dynamic:true}).includes("gif") || (custom && custom.emoji && custom.emoji.id)) {
          //user has nitro 
          flags.push(`NITRO_CLASSIC`)
          
          const guild = d.client.guilds.cache.find(g => g.members.cache.has(user.id) && g.members.cache.get(user.id).premiumSince !== null) 
          
          if (guild) flags.push(`NITRO_BOOSTING`)
      }
      
      return {
        code: code.replaceLast(`$getUserBadges${after}`, flags.length === 0 ? "none" : flags.map(badge => badge.toLowerCase().split("_").map(word => word.replace(word[0], word[0].toUpperCase())).join(" ")).join(", "))
      } 
    } else {
      const flags = d.message.author.flags.toArray()
      
      const custom = d.message.author.presence.activities.find(c => c.type === "CUSTOM_STATUS") 
      
      if (d.message.author.displayAvatarURL({dynamic:true}).includes("gif") || (custom && custom.emoji && custom.emoji.id)) {
          flags.push(`NITRO_CLASSIC`) 
          
          const guild = d.client.guilds.cache.find(g => g.members.cache.has(d.message.author.id) && g.members.cache.get(d.message.author.id).premiumSince !== null) 
          
          if (guild) flags.push(`NITRO_BOOSTING`)
      }
      
      return {
        code: code.replaceLast(`$getUserBadges`, flags.length === 0 ? "none" :  flags.map(badge => badge.toLowerCase().split("_").map(word => word.replace(word[0], word[0].toUpperCase())).join(" ")).join(", ")) 
      } 
    } 
  } catch (error) {
    return d.error(`:x: ${error.message}`)
  }
} 