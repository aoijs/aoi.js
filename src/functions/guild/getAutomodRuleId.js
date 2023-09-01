module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [guildID, automodRuleName, force = true] = data.inside.splits;

    const guild = await d.client.guilds.fetch(guildID);

    const autoModerationRules = await guild.autoModerationRules.fetch({ force: force, cache: force === false ? true : false });
    const result = autoModerationRules.find(rule => rule.name === automodRuleName || rule.id === automodRuleName);

    data.result = result.id;

    return {
        code: d.util.setCode(data),
    };
}