module.exports = async (d) => {
  const inside = d.unpack();

  const fields = inside.splits;

  var type = fields[0] || "all";

  var guildID = fields[1] || d.message.guild.id;

  var count = d.message.guild.emojis.cache.size;

  var guild = d.client.guilds.cache.get(guildID)

  if (guild === undefined) {
    return d.error(`\`Invalid guild ID\``)
  }

  if (type === "animated") {
    count = guild.emojis.cache.filter(a => a.animated === true).size
  } else if(type === "normal") {
    count = guild.emojis.cache.filter(a => a.animated === false).size
  } else if (type === "all") { 
    count = guild.emojis.cache.size
  }

  return {
    code: d.command.code.replaceLast(
      `$emojiCount${inside}`,
      count
    ),
  };
};