const {ReactionUserManager} = require("discord.js");

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [guildId, emojiId, name, ...roles] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const emoji = await d.util.getEmoji(guild, emojiId)
    if (!emoji) return d.aoiError.fnError(d, 'emoji', {inside: data.inside});

    emoji.edit({name: name.addBrackets(), roles: roles}).catch(e => {
        d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Failed To Modify Emoji With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}