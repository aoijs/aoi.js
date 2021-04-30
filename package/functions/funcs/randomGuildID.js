module.exports = async d => {
    const code = d.command.code

    let guild = d.client.guilds.cache.random()

    if (!d.randoms["5"]) d.randoms["0"] = guild.id
    else guild = d.randoms["5"]
    
    return {
        randoms: d.randoms,
        code: code.replaceLast(`$randomGuildID`, guild.id ? guild.id : guild)
    }
}