module.exports = async d => {
    const code = d.command.code
	
    let channel = d.message.guild.channels.cache.filter(e => e.type === "text").random()

    if (!d.randoms["2"]) d.randoms["2"] = channel.id
    else channel = d.randoms["2"]
    
    return {
        randoms: d.randoms,
        code: code.replaceLast(`$randomChannelID`, channel.id ? channel.id : channel)
    }
}