const defaultNotif = {
    ONLY_MENTIONS: "Only Mentions",
    ALL_MESSAGES: "All Messages"
}
module.exports = async d => {
    const {code, inside} = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    return {
        code: d.util.setCode({function: d.func, code, inside, result: defaultNotif[guild.defaultMessageNotification]})
    }
}