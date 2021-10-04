module.exports = async (d) => {
  const inside = d.unpack();

  const fields = inside.splits;

  var type = fields[0] || "all";
  
  var count = d.message.guild.emojis.cache.size;

  if (type === "animated") {
    count = d.client.emojis.cache.filter(a => a.animated === true).size
  } else if(type === "normal") {
    count = d.client.emojis.cache.filter(a => a.animated === false).size
  } else if (type === "all") { 
    count = d.client.emojis.cache.size
  }

  return {
    code: d.command.code.replaceLast(
      `$allEmojiCount${inside}`,
      count
    ),
  };
};