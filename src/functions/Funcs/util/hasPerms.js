const {Perms} = require("../../../utils/Constants.js");

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID, userId, ...perms] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    perms = perms.map(x => Perms[x]);
    if (perms.includes(undefined)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, "Invalid Permission Provided In");

    const memPerms = member.permissions.toArray()

    data.result = memPerms.includes("ADMINISTRATOR") ? true : perms.every(x => memPerms.includes(x));

    return {
        code: d.util.setCode(data)
    }
}
