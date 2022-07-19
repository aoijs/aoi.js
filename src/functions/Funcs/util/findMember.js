module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [memberResolver, returnSelf = "yes", guildID = d.guild.id] = data.inside.splits;
    memberResolver = memberResolver.addBrackets().replace(/[\\<>@!]/g, '').trim();

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = d.util.findMember(guild, memberResolver) || (returnSelf === "yes" ? d.author.id : undefined);

    return {
        code: d.util.setCode(data)
    }
} 