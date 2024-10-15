/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, option = "name", sep = ", "] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);

    const autoModerationRules = await guild.autoModerationRules.fetch({ force: true });
    data.result = autoModerationRules.map((automodRule) => {
        if (option.includes("{")) {
            return option.replaceAll(/{(.+?)}/g, (_, prop) => automodRule[prop]);
        } else {
            return automodRule[option];
        }
    })
    .join(sep)
    .removeBrackets();


    return {
        code: d.util.setCode(data)
    };
};
