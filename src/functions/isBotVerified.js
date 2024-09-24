const { UserFlags } = require('discord.js');

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = user.flags.has(UserFlags.VerifiedBot);

    return {
        code: d.util.setCode(data)
    }
}