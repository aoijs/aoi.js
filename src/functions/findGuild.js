/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [resolve] = data.inside.splits;

    const guild = d.client.guilds.cache.get(resolve) || d.client.guilds.cache.find(g => g.name.toLowerCase() === resolve.toLowerCase());

    data.result = guild ? guild.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}
