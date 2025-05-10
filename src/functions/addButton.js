/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [index, label, style, custom, disabled = "false", emoji] = data.inside.split(";");

    if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");

    index = Number(index) - 1;
    style = isNaN(style) ? d.util.constants.ButtonStyleOptions[style.toUpperCase()] : Number(style);
    disabled = disabled === "true";

    if (!style || style > 6 || style < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Style Provided In");

    if (!Array.isArray(d.components)) d.components = [];

    let emojiObj;
    if (emoji) {
        const resolvedEmoji = await d.util.getEmoji(d, emoji);
        if (resolvedEmoji?.id) {
            emojiObj = {
                id: resolvedEmoji.id,
                name: resolvedEmoji.name,
                animated: resolvedEmoji.animated ?? false
            };
        } else {
            emojiObj = {
                name: emoji.trim()
            };
        }
    }

    const button = {
        label,
        type: 2,
        style,
        disabled
    };

    if (emojiObj) {
        button.emoji = emojiObj;
    }

    if (style === 6) {
        delete button.label;
        delete button.emoji;
        button["sku_id"] = custom;
    } else if (style === 5) {
        button["url"] = custom;
    } else {
        button["customId"] = custom;
    }

    if (!d.components[index]) d.components[index] = { type: 1, components: [] };
    d.components[index].components.push(button);

    return {
        code: d.util.setCode(data)
    };
};
