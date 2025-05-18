const { readFileSync } = require("node:fs");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID = d.guild?.id, name, sound, emoji, reason, volume = 1] = data.inside.splits;

    const guild = d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    const file = readFileSync(sound, { encoding: "base64" }).catch((err) => {
        return d.aoiError.fnError(d, "custom", {}, "Failed to read sound file: " + err);
    });

    if (!file) return d.aoiError.fnError(d, "custom", {}, "Failed to read sound file");

    emoji = await d.util.getEmoji(d, emoji);
    if (!emoji) return d.aoiError.fnError(d, "emoji", { inside: data.inside });

    if (isNaN(volume) || ![0, 1].includes(volume)) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "The volume (a double) for the soundboard sound, must be 0 (inclusive) or 1 (default)");
    }

    await guild.soundboardSounds
        .create({
            name,
            file,
            emojiId: emoji.id || undefined,
            emojiName: emoji.name || undefined,
            volume: parseInt(volume),
            reason: reason?.addBrackets()
        })
        .catch((error) => {
            d.aoiError.fnError(d, "custom", {}, "Failed to create soundboard sound with reason: " + error);
        });

    return {
        code: d.util.setCode(data)
    };
};
