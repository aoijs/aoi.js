const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const inside = d.unpack();
  if (data.err) return d.error(data.err);

  let [customId, label, style, disabled, emoji, messageID, channelID = d.channel.id] = data.inside.splits;

  const channel = await d.util.getChannel(d, channelID);
  if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
  const message = await d.util.getMessage(channel, messageID);
  if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });
  if (!customId) return d.aoiError.fnError(d, "custom", { inside }, "Empty customId was provided");

  const components = message.components;

  const index = components.findIndex(row =>
    row.components.some(button => button.customId === customId)
  );

  if (index !== -1) {
    const row = components[index];
    const newButtons = row.components.map(button => {
      if (button.customId === customId) {
        const newButton = new ButtonBuilder()
          .setLabel(label || button.label)
          .setStyle(style || button.style)
          .setDisabled(disabled ? JSON.parse(disabled) : button.disabled);
        if (emoji) newButton.setEmoji(emoji || button.emoji);
        style != 5
          ? newButton.setCustomId(customId)
          : newButton.setURL(custom || button.url);
        return newButton;
      } else {
        return button;
      }
    });

    components[index] = new ActionRowBuilder().addComponents(newButtons);
    await message.edit({ components });
  }

  return {
    code: d.util.setCode(data)
  };
};
