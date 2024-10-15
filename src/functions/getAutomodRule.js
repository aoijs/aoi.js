/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, name, option = "name"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);

    const autoModerationRules = await guild.autoModerationRules.fetch({ force: true });
    const autoModerationRule = autoModerationRules.find((rule) => rule.name === name || rule.id === name);
    data.result = option.includes("{") ? option.replaceAll(/{(.+?)}/g, (_, prop) => autoModerationRule[prop]) : autoModerationRule[option];

    return {
        code: d.util.setCode(data)
    };
};
