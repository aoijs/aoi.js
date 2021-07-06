module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$createWebhook").length - 1;

  const inside = code.split("$createWebhook")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    channelID,
    name,
    avatar,
    returnW = "no",
    separator = "/",
  ] = inside.splits;
  //DBD.JS is cool xd
  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``);

  const webhook = await channel
    .createWebhook(name, {
      avatar: avatar,
    })
    .catch((err) => null);

  if (!webhook) return d.error(`\`Failed to create webhook\``);

  return {
    code: code.replaceLast(
      `$createWebhook${inside}`,
      returnW === "yes" ? webhook.id + separator + webhook.token : ""
    ),
  };
};
