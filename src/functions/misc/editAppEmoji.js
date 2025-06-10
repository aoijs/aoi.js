/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emojiName, name, returnEmoji = "false"] = data.inside.splits;

    // https://discord.js.org/docs/packages/discord.js/14.16.1/ApplicationEmojiManager:Class#edit
    const emoji = await d.util.getEmoji(d, emojiName);
    if (!emoji) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Emoji");

    await d.client.application.emojis
        .edit(emoji, {
            name: name.trim()
        })
        .catch((e) => {
            return d.aoiError.fnError(d, "custom", { inside: data.inside }, e);
        });

    return {
        code: d.util.setCode(data)
    };
};
