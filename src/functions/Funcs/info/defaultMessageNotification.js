module.exports = async d => {
    const type = {
        0: "All Messages",
        1: "Only Mentions"
    }

    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = type[guild.defaultMessageNotifications];

    return {
        code: d.util.setCode(data)
    }
}