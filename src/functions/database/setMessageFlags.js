const { MessageFlags } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...flags] = data.inside.splits;

    return {
        code: d.util.setCode(data),
        flags: flags.map((x) => MessageFlags[x.trim()])
    };
};
