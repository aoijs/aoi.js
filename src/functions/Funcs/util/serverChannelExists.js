const {Data} = require("dbdjs.db");

module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) d.error(err);

    let [channel, guildId = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside});

    channel = guild.channels.cache.find(x => x.name.toLowerCase() === channel.toLowerCase().addBrackets() || x.id === channel)

    const result = channel ? true : false

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}