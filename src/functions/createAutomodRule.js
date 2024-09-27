/**
 * @param {import("..").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, name, enabled = "true", reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);

    if (!d.data.automodRule) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "missing automod data");
    
    await guild.autoModerationRules.create({
        name,
        eventType: 1,
        triggerType: Number(d.data.automodRule.triggerType),
        triggerMetadata: d.data.automodRule?.triggerMetadata ?? {},
        actions: [d.data.automodRule?.actions] ?? [],
        enabled: enabled === "true",
        exemptRoles: d.data.automodRule?.exemptRoles ?? [],
        exemptChannels: d.data.automodRule?.exemptChannels ?? [],
        reason
    }).catch(e => {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Failed to create automod rule: " + e);
    });
    
    return {
        code: d.util.setCode(data),
    };
}
