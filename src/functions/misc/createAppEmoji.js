/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, url, returnEmoji = "false"] = data.inside.splits;

    // https://discord.js.org/docs/packages/discord.js/14.16.1/ApplicationEmojiManager:Class#create
    const emoji = await d.client.application.emojis
        .create({
            attachment: url.trim().addBrackets(),
            name
        })
        .catch((e) => {
            return d.aoiError.fnError(d, "custom", { inside: data.inside }, e);
        });

    data.result = returnEmoji === "true" ? emoji.toString() : undefined;

    return {
        code: d.util.setCode(data)
    };
};
