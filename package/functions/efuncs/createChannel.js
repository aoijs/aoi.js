const types = [
  "GUILD_TEXT",
  "GUILD_VOICE",
  "GUILD_CATEGORY",
  "GUILD_NEWS",
  "GUILD_STORE",
  "GUILD_STAGE_VOICE",
];

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [name, type = "text", returnID = "no", parentID] = inside.splits;

  type = type.toLowerCase();

  if (!types.includes(type))
    return d.error(
      `${d.func}: Invalid channel type '${type}' in ${inside}`
    );

  let channel;

    channel = await d.message.guild.channels
      .create(name.addBrackets(), {
        type,
        parent: parentID ? parentID : null,
      })
      .catch((err) => null);


  if (!channel)
    return d.error(`${d.func}: Could not create channel '${name}:${type}'!`);

  return {
    code: code.replaceLast(
      `$createChannel${inside}`,
      returnID === "yes" ? channel.id : ""
    ),
  };
};
