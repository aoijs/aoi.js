module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, name, triggerType, triggerMetadata, actions, enabled = true, exemptRoles, exemptChannels, reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    
    if (isNaN(Number(triggerType))) {
        return d.aoiError.fnError(d, "custom", {}, "argument(s). \`" + data.inside.splits[2] + "\` is not a valid triggerType.");
    }

    await guild.autoModerationRules.create({
        name,
        eventType: 1,
        triggerType: Number(triggerType),
        triggerMetadata: triggerMetadata === "" ? {} : JSON.parse(triggerMetadata),
        actions: actions === "" ? {} : JSON.parse(actions),
        enabled: Boolean(enabled),
        exemptRoles: exemptRoles ? exemptRoles.split(',').map(role => role.trim()) : [],
        exemptChannels: exemptChannels ? exemptChannels.split(',').map(channel => channel.trim()) : [],
        reason
    });

    return {
        code: d.util.setCode(data),
    };
}
