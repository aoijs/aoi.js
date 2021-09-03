module.exports = async d => {
    const code = d.command.code

    let role = d.message.guild.roles.cache.random()

    if (!d.randoms["20"]) d.randoms["2"] = role.id
    else role = d.randoms["20"]
    
    return {
        randoms: d.randoms,
        code: code.replaceLast(`$randomRoleID`, role.id ? role.id : role)
    }
}