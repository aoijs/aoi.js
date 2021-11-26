module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const [guildId = d.guild.id] = inside.splits;
    const guild = await d.util.getGuild(d, guildId)
    let result;
    result = await guild.bans.fetch().catch(err => {
        result = 0;
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch Bans");
    })
    result = isNaN(result) ? result.size : result;

    return {
        code: d.util.setCode({code, inside, function: d.func, result})
    }
}
