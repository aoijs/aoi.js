/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, name, type, returnID = 'false', parentId] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    name = name.addBrackets();

    type = d.util.channelTypes[type];

    let result = await guild.channels.create(
        {
            name,
            type,
            parent: parentId,
        }).catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Create Channel With Reason: " + e);
    });
    
    data.result = returnID === 'true' ? result.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}