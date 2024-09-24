/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, separator = ", "] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', { inside: data.inside });

    const autoModRules = await guild.autoModerationRules.fetch();

    data.result = autoModRules.map((rule) => rule.name).join(separator);

    return {
        code: d.util.setCode(data)
    };
};
