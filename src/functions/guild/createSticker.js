const {AttachmentBuilder} = require("discord.js");
module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [guildID, url, name, returnSticker = "false", tags, description, reason] =
        inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

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
        code: d.util.setCode({function: d.func, code, inside, result}),
        sticker: d.stickers,
    };
};
