const { AutoModerationRuleTriggerType } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [type = "Keyword"] = data.inside.splits;

    if (!AutoModerationRuleTriggerType[type.addBrackets()]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Trigger Type");

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                triggerType: AutoModerationRuleTriggerType[type.addBrackets()], 
            },
        },
    };
}