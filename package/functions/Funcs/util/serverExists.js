module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const guildId = data.inside.inside;

    data.result = d.util.getGuild(d, guildId) ? true : false;

    return {
        code: d.util.setCode(data)
    }
}