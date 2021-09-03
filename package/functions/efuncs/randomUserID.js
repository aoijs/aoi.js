module.exports = async d => {
    const code = d.command.code
	
    let user = d.message.guild.members.cache.filter(e => !e.user.bot).random()

    if (!d.randoms["0"]) d.randoms["0"] = user.user.id
    else user = d.randoms["0"]
    
    return {
        randoms: d.randoms,
        code: code.replaceLast(`$randomUserID`, user.user ? user.user.id : user)
    }
}