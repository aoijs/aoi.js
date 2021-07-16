module.exports = async d => {
  const code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const [
    userID,
    reason
  ] = inside.splits
  
  const member = await d.message.guild.members.fetch(userID).catch(err => null)
  
  if (!member || typeof member.kick === "undefined") return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)
  
  const m = await member.kick(reason).catch(err => {})
  
  if (!m) return d.error(`\`Failed to kick ${member.user.username}\``)
  
  return {
    code: code.replaceLast(`$kick${inside}`, "")
  }
}