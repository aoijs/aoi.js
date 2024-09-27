/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name] = data.inside.splits;

    // https://discord.js.org/docs/packages/discord.js/14.16.1/ApplicationEmojiManager:Class#delete
    const emoji = await d.util.getEmoji(d, name);
    if (!emoji) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Emoji");
    await d.client.application.emojis.delete(emoji.id).catch((e) => {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, e);
    });

    return {
        code: d.util.setCode(data)
    };
};
