module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const guildID = data.inside.inside;

    data.result = !!(await d.util.getGuild(d, guildID));

    return {
        code: d.util.setCode(data)
    }
}