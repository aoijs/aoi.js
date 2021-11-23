module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [guildId, id] = inside.splits;
    const guild = guildId === "global" ? undefined : await d.util.getGuild(d, guildId);
    if (!guild && !["global"].includes(guildId)) return d.aoiError.fnError(d, "guild", {inside});

    d.client.application.commands.delete(id, guildId === 'global' ? undefined : guildId).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Application Command With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 