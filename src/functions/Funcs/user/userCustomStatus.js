module.exports = async d => {
    const {ActivityType} = require("discord.js");
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, guildID = d.guild?.id, type = 'state'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const user = await d.util.getMember(d.guild, userID);
    if (!user) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const status = user.presence?.activities?.find(x => x.type === ActivityType.Custom);
    data.result = status?.[type] || "none";

    return {
        code: d.util.setCode(data)
    }
}
