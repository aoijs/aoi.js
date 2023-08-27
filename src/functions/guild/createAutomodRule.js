module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID, ruleName, triggerType, eventType, actionType, reason, enableRule = true, ...rest] = data.inside.splits;

    const guild = await d.client.guilds.fetch(guildID);

    if (isNaN(parseInt(triggerType)) || isNaN(parseInt(eventType)) || isNaN(parseInt(actionType))) {
        return d.aoiError.fnError(d, "custom", {}, "argument(s). Expected integers for triggerType, eventType, and actionType.");
    }

    const triggerMetadata = {
        keywordFilter: rest.slice(0, rest.length - (rest.length > 2 ? 2 : 0)),
        regexPatterns: [],
        presets: [],
        allowList: [],
        mentionTotalLimit: null,
    };

    const actions = [
        {
            type: parseInt(actionType),
            reason: reason,
            metadata: {},
        },
    ];

    const autoModRule = await guild.autoModerationRules.create({
        name: ruleName,
        eventType: parseInt(eventType),
        triggerType: parseInt(triggerType),
        triggerMetadata,
        actions,
        enabled: enableRule === "true",
        exempt_roles: rest.length > 1 ? rest[rest.length - 2].split(",") : [],
        exempt_channels: rest.length > 1 ? rest[rest.length - 1].split(",") : [],
    });

    return {
        code: d.util.setCode(data),
    };
}
