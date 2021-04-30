const embed = require("../../handlers/errors.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelSendMessage").length - 1;

  const inside = code.split("$channelSendMessage")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const [channelID, text, returnID = "no"] = fields;

  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(
      `:x: Invalid channel ID in \`$channelSendMessage${inside}\``
    );

  const m = await embed(d, text, "withMessage", channel);

  return {
    code: code.replaceLast(
      `$channelSendMessage${inside}`,
      returnID === "yes" && m ? m.id : ""
    ),
  };
};
