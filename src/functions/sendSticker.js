/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  let [resolver] = data.inside.splits;

  const guild = d.client.guilds.cache.get(d.guild?.id);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

  const sticker = await d.util.getSticker(guild, resolver);
  if (!sticker) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "sticker");
  
  try {
    await d.channel.send({ stickers: [sticker.id] });
   } catch (err) {
    return d.aoiError.fnError(d, "custom", { inside: data.inside }, `Failed to send resolver: ${err}`);
  }

  return { code: d.util.setCode(data) };
};
