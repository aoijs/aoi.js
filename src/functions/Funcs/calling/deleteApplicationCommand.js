module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [guildID, id] = inside.splits;
    const guild = guildID === "global" ? undefined : await d.util.getGuild(d, guildID);
    if (!guild && !["global"].includes(guildID)) return d.aoiError.fnError(d, "guild", {inside});

    d.client.application.commands.delete(id, guildID === 'global' ? undefined : guildID).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Application Command With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
} 