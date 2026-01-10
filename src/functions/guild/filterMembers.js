module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildId, filter, returnAs = "{mention}", total = "5", separator = ","] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    const filters = filter
        .split(" ")
        .map((f) => f.trim())
        .filter((f) => f);

    const members = guild.members.cache
        .filter((m) => {
            return filters.every((f) => {
                if (f === "bots") return m.user.bot;
                if (f === "members") return !m.user.bot;
                if (f === "boosters") return m.premiumSince;
                if (f === "online") return ["online", "idle", "dnd"].includes(m.presence?.status);
                if (f === "offline") return m.presence?.status === "offline" || !m.presence;
                if (f.startsWith("role:")) {
                    const roleIds = f
                        .slice(5)
                        .split(",")
                        .map((r) => r.trim());
                    return roleIds.some((roleId) => m.roles.cache.has(roleId));
                }
                return true;
            });
        })
        .map((m) => m.user);

    data.result = members
        .slice(0, total)
        .map((m) => {
            return returnAs.replace("{username}", m.username).replace("{discriminator}", m.discriminator).replace("{tag}", m.tag).replace("{id}", m.id).replace("{mention}", `<@${m.id}>`);
        })
        .join(separator);

    return {
        code: d.util.setCode(data)
    };
};
