const { ActionRowBuilder } = require("discord.js");

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [messageId = d.message?.id, customId, channelId = d.channel?.id] = data.inside.splits;

  if (!customId) return d.aoiError.fnError(d, "custom", {}, "Custom Id");
  if (!messageId) return d.aoiError.fnError(d, "custom", {}, "Message Id");
  if (!channelId) return d.aoiError.fnError(d, "custom", {}, "Channel Id");

  const channel = await d.util.getChannel(d, channelId);
  const message = await d.util.getMessage(channel, messageId);

  if (message.components.length === 0) {
    data.result = null;
  } else {
    const row = message.components.map((x) => {
      const components = x.components.filter(
        (button) => button.customId !== customId
      );
      return new ActionRowBuilder().addComponents(components).toJSON();
    });

    message.edit({
      components: row[0].components.length > 0 ? row.flat() : [],
    });
  }

  return {
    code: d.util.setCode(data),
  };
};
