const {Role} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [roleId, option = 'name', guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleId).catch(err => {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    });

    data.result = Role(role)[option];

    return {
        code: d.util.setCode(data)
    }
}