const {Role} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID = d.guild?.id, roleID,] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleID).catch(err => {
        d.aoiError.fnError(d, 'role', {inside: data.inside});
    });

    data.result = role.iconURL({dynamic: true, size: 1024});

    return {
        code: d.util.setCode(data)
    }
}