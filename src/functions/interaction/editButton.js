const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const inside = d.unpack();
  if (data.err) return d.error(data.err);

  let [index, customId, custom, label, style, disabled, emoji, messageID, channelID = d.channel.id] = data.inside.splits;

  const channel = await d.util.getChannel(d, channelID);
  if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });
  const message = await d.util.getMessage(channel, messageID);
  if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });
  if (!customId) return d.aoiError.fnError(d, "custom", { inside }, "Empty customId was provided");
  if (isNaN(index) || Number(index) < 1) d.aoiError.fnError(d, "custom", {inside}, "Invalid Index Provided In");
  index = Number(index) - 1;
  if (style) {
    style = d.util.constants.ButtonStyleOptions[style] || Number(style);
    if (style > 5 || style < 1) d.aoiError.fnError(d, "custom", { inside }, "Invalid Style Provided In");
  }
  const components = message.components;
  if (!components[index]) components[index] = { type: 1, components: [] };
  const rows = [];
  components[index].components.forEach(button => {
    if (button.customId === customId) {
      const newButton = new ButtonBuilder()
        .setLabel(label || button.label)
        .setStyle(style || button.style)
        .setDisabled(disabled ? JSON.parse(disabled) : button.disabled);
      if (emoji) newButton.setEmoji(emoji || button.emoji);
      style != 5
        ? newButton.setCustomId(custom || button.customId)
        : newButton.setURL(custom || button.url);
      rows.push(newButton);
    } else {
      rows.push(button);
    }
  });
  components[index] = new ActionRowBuilder().addComponents(rows);
  await message.edit({ components });
  return {
    code: d.util.setCode(data)
  };
};
