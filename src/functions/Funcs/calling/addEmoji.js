module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [guildID, url, name, returnEmoji = "no", reason, ...roles] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const emoji = await guild.emojis.create({
        attachment: url.addBrackets(),
        name: name.addBrackets(),
        reason: reason,
        roles: roles.length ? roles : undefined
    })
        .catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));

    data.result = returnEmoji === "yes" ? emoji.toString() : undefined
    return {
        code: d.util.setCode(data)
    }
}

