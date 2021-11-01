const { Perms } = require('../../../Utils/Constants.js');

module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
    const err = d.inside(inside)

    if (err) return d.error(err)

    const [channelID, userID, ...perms] = inside.splits

    const channel = await d.util.getChannel(d, channelID, true);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside });

    const user = await d.util.getUser(d, userId);
    if (!user) return d.aoiError.fnError(d, 'user', { inside: data.inside });

    const pms = perms.map(key => Perms[key])
    if (pms.includes(undefined)) return d.aoiError.fnError(d, 'custom', { inside: data.inside }, `Invalid Permissions In`);

    const upms = channel.permissionsFor(userID)

    data.result = upms && pms.every(p => upms.has(p));
    return {
        code: d.util.setCode(data)
    }
}