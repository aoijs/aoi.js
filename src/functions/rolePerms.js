const {FormatPerms: Permissions} = require('../utils/Constants.js');

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [roleID, sep = ' , ', guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleID).catch(err => {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    });

    const PERMS = Object.entries(Permissions);

    data.result = role.permissions.toArray().map(y => PERMS.find(x => x[1] === y)?.[0]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}