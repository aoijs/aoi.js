const {AttachmentBuilder} = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, url, name, returnSticker = "false", tags, description, reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    const file = new AttachmentBuilder(url);

    const sticker = await guild.stickers
        .create({file, name, tags, description, reason})
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Create Sticker With Reason: ${e}`,
            );
        });

    if (returnSticker === "true") d.stickers.push(sticker);
    
    return {
        code: d.util.setCode(data),
        sticker: d.stickers,
    };
};
