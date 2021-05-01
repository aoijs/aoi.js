module.exports = d => {
 if (!d.message.guild) return {code:d.command.code.replaceLast(`$randomEmoji${inside.total ? inside.total : ""}`, "")
 const inside = d.unpack();
 let [guildId] = inside.splits;
 
 const guild = d.client.guilds.cache.get(guildId) || d.client.guilds.cache.get(d.message.guild.id);
 if (!guild.emojis.cache.size) return {code:d.command.code.replaceLast(`$randomEmoji${inside.total ? inside.total : ""}`, "")
 const rnd = Math.min(Math.min(Math.random() * guild.emojis.cache.size, 0, guild.emojis.cache.size - 1);
 const emoji = guild.emojis.cache.array().find((_, i) => i === rnd);
 
 if (emoji.deleted) return {code:d.command.code.replaceLast(`$randomEmoji${inside.total ? inside.total : ""}`, "");
 
 return {code:d.command.code.replaceLast(`$randomEmoji${inside.total ? inside.total : ""}`, `<:${emoji.name}:${emoji.id}>`)
}
