const { Permissions } = require('../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, roleID, ...perms] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = await guild.roles.fetch(roleID).catch(e => undefined);
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});

    let arrayPerms = role.permissions.toArray(); // make array array
    if (perms.includes('+all')) {
        arrayPerms = ['Administrator']; 
    } else if (perms.includes('-all')) {
        arrayPerms = [];
    } else {
        for (const perm of perms) {
            const sign = perm.slice(0, 1);
            if (sign === '+') {
                arrayPerms.push(Permissions[perm.slice(1)]); 
            } else if (sign === '-') {
                const index = arrayPerms.indexOf(Permissions[perm.slice(1)]);
                if (index !== -1) {
                    arrayPerms.splice(index, 1); 
                }
            }
        }
    }

    role.setPermissions(arrayPerms).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Channel Permissions With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}
