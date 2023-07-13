const {FormatPerms: Perms} = require('../../utils/Constants.js')

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID = d.channel?.id, roleoruserID, ...perms] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});

    let objPerms = {};

    for (const perm of perms) {
        const sign = perm.slice(0, 1);
        objPerms[Perms[perm.slice(1)]] = sign === '+' ? true : sign === '/' ? null : false;
    }

    channel.permissionOverwrites.edit(roleoruserID, objPerms).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Channel Perms With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}