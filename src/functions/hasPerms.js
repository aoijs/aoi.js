const {Permissions} = require("../utils/Constants.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, userID, ...perms] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getMember(guild, userID);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    perms = perms.map(x => Permissions[x]);
    if (perms.includes(undefined)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Permission Provided In");

    const memPerms = member.permissions

    data.result = memPerms.has(Permissions.administrator) ? true : perms.every(x => memPerms.has(x));

    return {
        code: d.util.setCode(data)
    }
}
