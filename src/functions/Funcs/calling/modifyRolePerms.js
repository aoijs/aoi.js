const {Perms} = require('../../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [guildId, roleId, ...perms] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleId).catch(e => undefined);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});

    let arrayPerms = new Set(role.permissions.toArray());
    if (perms.includes('+all')) {
        arrayPerms = ['ADMINISTRATOR'];
    } else if (perms.includes('-all')) {
        arrayPerms = [];
    } else {
        for (const perm of perms) {
            const sign = perm.slice(0, 1);

            if (sign === '+') {
                arrayPerms.add(Perms[perm.slice(1)]);
            } else if (sign === '-') {
                arrayPerms.remove(Perms[perm.slice(1)]);
            }
            arrayPerms = Array.from(arrayPerms);
        }
    }

    role.setPermissions(arrayPerms).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Channel Perms With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}