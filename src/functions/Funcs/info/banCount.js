module.exports = async d => {
    const data = d.util.aoiFunc(d);
    let [guildID = d.guild.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID)
    let result;
    data.result = await guild.bans.fetch().catch(err => {
        result = 0;
        d.aoiError.fnError(d, "custom", {}, "Failed To Fetch Bans");
    })
    data.result = isNaN(data.result) ? data.result.size : data.result;

    return {
        code: d.util.setCode(data)
    }
}
