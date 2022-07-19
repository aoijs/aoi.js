module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    let [guildID, name, type, returnId = 'no', parentId] = inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    name = name.addBrackets();

    type = d.util.channelTypes[type];

    let result = await guild.channels.create(
        name,
        {
            type,
            parent: parentId,
        }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Channel With Reason: " + e);
    });
    result = returnId === 'yes' ? result.id : undefined;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}