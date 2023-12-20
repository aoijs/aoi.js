module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [guildID, sticker] = inside.splits;
    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    sticker = await d.util.getSticker(d.guild, sticker);
    if (!sticker) return d.aoiError.fnError(d, "sticker", {inside});

    sticker.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Sticker: " + sticker.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}