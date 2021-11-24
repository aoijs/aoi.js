const {Perms} = require('../../../utils/Constants.js');
const {Permissions} = require('discord.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    let [...perms] = data.inside.splits;

    if (perms.some(perm => !Perms[perm] && !Permissions.FLAGS[perm] && isNaN(perm))) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Perm(s) Provided In');
    perms = perms.map(perm => Perms[perm] || Permissions.FLAGS[perm] || perm);
    data.result = d.client.generateInvite({
        scopes: ['bot', 'applications.commands'],
        permissions: perms
    })

    return {
        code: d.util.setCode(data)
    }
}
