module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const guildId = data.inside.inside;

    data.result = !!(await d.util.getGuild(d, guildId));

    return {
        code: d.util.setCode(data)
    }
}