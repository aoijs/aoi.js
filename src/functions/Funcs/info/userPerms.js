const {Perms} = require('../../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, sep = ' , ', guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});


    const PERMS = Object.entries(Perms);

    data.result = member.permissions.toArray().map(y => PERMS.find(x => x[1] === y)?.[0]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}