/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID, automodRuleName, reason, force = true] = data.inside.splits;

    const guild = await d.client.guilds.fetch(guildID);

    const autoModerationRules = await guild.autoModerationRules.fetch({ force: force, cache: force === false ? true : false });

    const automodRule = autoModerationRules.find(rule => rule.name === automodRuleName || rule.id === automodRuleName);

    guild.autoModerationRules.delete(automodRule.id, { reason: reason })

    return {
        code: d.util.setCode(data),
    };
}