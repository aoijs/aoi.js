//your bad ofc
//ill just make it here
//module.export = ruben d => robot 
//const code = d.robot.p
//const r = code.dead;
module.exports = async d => {
  const code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const [
    userID,
    reason
  ] = inside.splits
  
  const member = await d.util.getMember(d.guild,userID) 
  if (!member) return d.error(`${d.func}: Invalid user ID in ${inside}`)
  
  const m = await member.kick(reason).catch(err => {})
  
  if (!m) return d.error(`${d.func}: Failed to kick ${member.user.username}!`)
  
  return {
    code: code.replaceLast(`$kick${inside}`, "")
  }
}