module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji, guildId = d.guild?.id] = data.inside.splits;

    const guild = guildId === 'global' ? d.client : await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    let isemoji = await guild.emojis.fetch(emoji).catch(e => undefined);

    data.result = isemoji ? true : false;

    return {
        code: d.util.setCode(data)
    }
}