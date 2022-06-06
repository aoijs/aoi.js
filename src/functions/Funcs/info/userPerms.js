const {Perms} = require('../../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, sep = ' , ', guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userID);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const PERMS = Object.entries(Perms);

    data.result = member.permissions.toArray().map(y => PERMS.find(x => x[1] === y)?.[0]).join(sep);

    return {
        code: d.util.setCode(data)
    }
}