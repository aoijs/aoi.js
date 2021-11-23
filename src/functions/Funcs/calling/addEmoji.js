module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    const [guildId, url, name, returnEmoji = "no", reason, ...roles] =
        inside.splits;
    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});
    const emoji = await guild.emojis
        .create(url.addBrackets(), name.addBrackets(), {
            reason,
            roles: roles.length ? roles : undefined,
        })
        .catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: returnEmoji === "yes" ? emoji.toString() : undefined,
        }),
    };
};
