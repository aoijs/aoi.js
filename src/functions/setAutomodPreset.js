const { AutoModerationRuleKeywordPresetType } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async(d) => {
    const data = d.util.aoiFunc(d);
    const [...presets] = data.inside.splits;

    return {
        code: d.util.setCode(data),
        data: { 
            automodRule: { 
                ...d.data.automodRule,
                presets: presets.map(preset => AutoModerationRuleKeywordPresetType[preset]), 
            },
        },
    };
}