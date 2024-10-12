const { ActionRow, StringSelectMenuBuilder, UserSelectMenuBuilder, RoleSelectMenuBuilder, MentionableSelectMenuBuilder, ChannelSelectMenuBuilder } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelId = d.channel?.id, messageId = d.channel?.id, index = 1, type, customId, placeholder, minValues = 1, maxValues = 1, disabled = "false", ...options] = data.inside.splits;

    const channel = d.client.channels.cache.get(channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await channel.messages.fetch(messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    index = Number(index) - 1;

    if (isNaN(index) || index < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");

    disabled = disabled === "true";
    placeholder = placeholder?.addBrackets();
    customId = customId?.addBrackets();
    minValues = Number(minValues);
    maxValues = Number(maxValues);

    if (!options.length && type === "string") return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Options Are Not Provided In");

    if (minValues > 25 || minValues < 0) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "minValues must be between 0 and 25 (both inclusive).");

    if (maxValues > 25 || maxValues < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "maxValues must be between 1 and 25 (both Inclusive).");

    if (placeholder.length > 100) return d.aoiError.fnError(d, "custom", {}, "Placeholder should be at most 100 Characters long");

    let selectBuilder;

    switch (type.toLowerCase()) {
        case "string":
            selectBuilder = new StringSelectMenuBuilder();
            break;
        case "user":
            selectBuilder = new UserSelectMenuBuilder();
            break;
        case "role":
            selectBuilder = new RoleSelectMenuBuilder();
            break;
        case "mentionable":
            selectBuilder = new MentionableSelectMenuBuilder();
            break;
        case "channel":
            selectBuilder = new ChannelSelectMenuBuilder();
            break;
        default:
            d.aoiError.fnError(d, "custom", {}, "Invalid Select Menu Type");
    }

    selectBuilder.setCustomId(customId).setPlaceholder(placeholder).setMaxValues(maxValues).setMinValues(minValues).setDisabled(disabled);

    if (type.toLowerCase() === "channel" && options.length !== 0) {
        for (const types of options) {
            selectBuilder.addChannelTypes(d.util.channelTypes[types]);
        }
    }

    let emoji, label, description, value, def;

    for (let option of options) {
        if (type.toLowerCase() !== "channel") {
            option = option.split(":");
            label = option[0].addBrackets();
            description = option[1].addBrackets();
            value = option[2].addBrackets();
            def = option[3]?.addBrackets() === "true";

            if (option.length > 4) {
                const emojiString = option.slice(4).join(":");
                emoji = await d.util.getEmoji(d, emojiString);
                if (!emoji) {
                    emoji = emojiString;
                } else {
                    emoji = {
                        name: emoji.name,
                        id: emoji.id,
                        animated: emoji.animated
                    };
                }
            }
        }

        switch (type.toLowerCase()) {
            case "string":
                selectBuilder.addOptions({
                    label,
                    description,
                    value,
                    default: def,
                    emoji
                });
                break;
            case "user":
            case "role":
            case "mentionable":
            case "channel":
                break;
            default:
                d.aoiError.fnError(d, "custom", { inside: data.inside }, "Select Menu Type");
        }
    }

    const components = d.data.components ? [...d.data.components] : [...message.components];

    components[index] = components[index] || { type: 1, components: [] };
    components[index].components.push(selectBuilder);

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
