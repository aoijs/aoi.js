const { AutoModerationActionType } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [type = "BlockMessage", channel, durationSeconds, customMessage] = data.inside.splits;

    if (!AutoModerationActionType[type.addBrackets()]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Trigger Type");

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                actions: {
                    type: AutoModerationActionType[type.addBrackets()],
                    channel,
                    durationSeconds,
                    customMessage
                }, 
            },
        },
    };
}