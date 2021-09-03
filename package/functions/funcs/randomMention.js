module.exports = async d => {
    const code = d.command.code

    let user = d.message.guild.members.cache.filter(e => !e.user.bot).random()

    if (!d.randoms["1"]) d.randoms["1"] = user.user.id
    else user = d.randoms["1"]
    
    return {
        randoms: d.randoms,
        code: code.replaceLast(`$randomMention`, user.user ? `<@${user.user.id}>` : `${user}`)
    }
}