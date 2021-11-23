const {Perms} = require('../../../utils/Constants.js')

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [roruId, channelId, ...perms] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    let objPerms = {};

    for (const perm of perms) {
        const sign = perm.slice(0, 1);
        objPerms[Perms[perm.slice(1)]] = sign === '+' ? true : sign === '/' ? null : false;
    }

    channel.permissionOverwrites.edit(roruId, objPerms).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Channel Perms With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}