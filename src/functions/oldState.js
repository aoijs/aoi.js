const { VoiceState } = require("../core/functions.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = VoiceState(d.data.oldVoiceState)[option];

    return {
        code: d.util.setCode(data)
    };
};
