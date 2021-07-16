module.exports = d => {
    const code = d.command.code

    const inside = d.unpack();

    let guild;

    var guildId = inside.inside;

    if(guildId == "global"){

    guild = d.client
    }
else{

    guild = d.client.guilds.cache.get(guildId) || d.client.guilds.cache.get(d.message.guild.id);
}
    if (!guild.emojis.cache.size) return {
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, "")
    }
    const emoji = guild.emojis.cache.random()
    if (emoji.deleted) return {
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, "")
    }
    return {
        code: code.replaceLast(`$randomEmoji${inside ? inside : ""}`, emoji.toString())

    }

}
