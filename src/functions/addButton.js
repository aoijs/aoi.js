/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [index, label, style, custom, disabled = "false", emoji] = data.inside.splits;

    if (isNaN(index) || Number(index) < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Index Provided In");

    index = Number(index) - 1;
    style = isNaN(style) ? d.util.constants.ButtonStyleOptions[style] : Number(style);
    disabled = disabled === "true";

    if (!style || style > 6 || style < 1) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Style Provided In");

    let emojiString;
    if (emoji) {
        emojiString = await d.util.getEmoji(d, emoji.addBrackets()).id;
        if (!emojiString) emojiString = emoji?.addBrackets().trim();
    }

    const button = {
        label,
        type: 2,
        style,
        disabled,
        emoji: emojiString
    };

    // premium
    if (style === 6) {
        delete button.label;
        delete button.emoji;
        button["sku_id"] = custom;
        // url
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
