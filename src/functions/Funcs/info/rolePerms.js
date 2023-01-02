const {FormatPerms: Perms} = require('../../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [roleId, sep = ' , ', guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleId).catch(err => {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    });

    const PERMS = Object.entries(Perms);

    data.result = role.permissions.toArray().map(y => PERMS.find(x => x[1] === y)?.[0]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}