const types = [
  "text",
  "dm",
  "voice",
  "group",
  "category",
  "news",
  "store",
  "stage",
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
      `:x: Invalid channel type '${type}' in \`$createChannel${inside}\``
    );

  let channel;

  if (type === "stage") {
    channel = await d.client.api.guilds(d.message.guild.id).channels.post({
      data: {
        name: name.addBrackets(),
        type: 13,
        parent_id: parentID ? parentID : null,
      },
    });
  } else {
    channel = await d.message.guild.channels
      .create(name.addBrackets(), {
        type,
        parent: parentID ? parentID : null,
      })
      .catch((err) => null);
  }

  if (!channel)
    return d.error(`:x: Could not create channel '${name}:${type}'!`);

  return {
    code: code.replaceLast(
      `$createChannel${inside}`,
      returnID === "yes" ? channel.id : ""
    ),
  };
};
