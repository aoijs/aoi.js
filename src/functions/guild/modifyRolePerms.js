const { Permissions } = require('../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, roleID, ...perms] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', { inside: data.inside });

    const role = await guild.roles.fetch(roleID).catch(e => undefined);
    if (!role) return d.aoiError.fnError(d, 'role', { inside: data.inside });

    let newPerms = BigInt(0);

    if (perms.includes('+all')) {
        newPerms = Permissions.ALL;
    } else if (perms.includes('-all')) {
        newPerms = BigInt(0);
    } else {
        for (const perm of perms) {
            const sign = perm.slice(0, 1);
            const permission = Permissions[perm.slice(1)];

            if (sign === '+') {
                newPerms |= BigInt(permission); 
            } else if (sign === '-') {
                newPerms &= ~BigInt(permission); 
            }
        }
    }

    role.setPermissions(newPerms).catch(e => {
        d.aoiError.fnError(d, 'custom', { inside: data.inside }, 'Failed To Modify Channel Permissions With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    };
};
