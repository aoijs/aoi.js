const { ActionRow } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelId = d.channel?.id, messageId = d.message?.id, index = "1", label, style, custom, disabled = "false", emoji] = data.inside.splits;

    if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");

    const channel = d.client.channels.cache.get(channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await channel.messages.fetch(messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    index = Number(index) - 1;
    style = isNaN(style) ? d.util.constants.ButtonStyleOptions[style] : Number(style);
    disabled = disabled === "true";

    if (!style || style > 6 || style < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Button Style Provided In");

    emoji = await d.util.getEmoji(d, emoji.addBrackets()).id;
    if (!emoji) emoji = emoji.addBrackets().trim();

    const button = {
        label,
        type: 2,
        style,
        disabled,
        emoji
    };

    button[style === 5 ? "url" : "customId"] = custom;

    const components = d.data.components ? [...d.data.components] : [...message.components];

    components[index] = components[index] || { type: 1, components: [] };
    components[index].components.push(button);

    const raw = components.map((component) => (component instanceof ActionRow ? component.toJSON() : component));

    await message.edit({ components: raw });

    return {
        code: d.util.setCode(data),
        data: {
            components: {
                ...raw
            }
        }
    };
};