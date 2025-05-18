module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildId, ...soundboardSounds] = data.inside.splits;

    const guild = d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    await guild.soundboardSounds.fetch();

    try {
        await Promise.all(
            soundboardSounds.map(async (sound) => {
                const soundboardSoundsResolvable = guild.soundboardSounds.cache.find((x) => x.name === sound || x.id === sound);

                if (!soundboardSoundsResolvable) {
                    return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Soundboard sound not found");
                }

                await guild.soundboardSounds.delete(sound);
            })
        );
    } catch (error) {
        return d.aoiError.fnError(d, "custom", {}, "Failed to delete soundboard sound with reason: " + error);
    }

    return {
        code: d.util.setCode(data)
    };
};
