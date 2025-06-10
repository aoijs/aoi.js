const { Routes } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [voiceID, voiceStatus] = data.inside.splits;

    if (voiceStatus.length > 300) return d.aoiError.fnError(d, "custom", {}, "Voice Status cannot be longer than 300 characters");

    try {
        await d.client.rest.put(Routes.channel(voiceID) + "/voice-status", {
            body: {
                status: voiceStatus.toString()
            }
        });
    } catch (e) {
        return d.aoiError.fnError(d, "custom", {}, e.message);
    }

    return {
        code: d.util.setCode(data)
    };
};
