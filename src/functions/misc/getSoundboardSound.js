module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildId, soundboardSound, property] = data.inside.splits;

    const guild = d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    await guild.soundboardSounds.fetch();

    const soundboardSoundsResolvable = guild.soundboardSounds.cache.find((x) => x.name === soundboardSound || x.id === soundboardSound);

    if (!soundboardSoundsResolvable) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Soundboard Sound");
    
    data.result = soundboardSoundsResolvable[property];

    return {
        code: d.util.setCode(data)
    };
};
