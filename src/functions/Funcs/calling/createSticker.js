const {MessageAttachment} = require("discord.js");
module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [guildid, url, name, returnSticker = "no", tags, description, reason] =
        inside.splits;

    const guild = await d.util.getGuild(d, guildid);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    const attachment = new MessageAttachment(url);

    const sticker = await guild.stickers
        .create(attachment, name, tags, {description, reason})
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed To Create Sticker With Reason: ${e}`,
            );
        });

    if (returnSticker === "yes") d.stickers.push(sticker);
    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
        sticker: d.stickers,
    };
};
