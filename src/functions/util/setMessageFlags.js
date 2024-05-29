const { MessageFlags } = require("discord.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [flags] = data.inside.splits;

    flags = [flags];

    return {
        code: d.util.setCode(data),
        flags: flags.map((x) => MessageFlags[x.trim()])
    };
};
