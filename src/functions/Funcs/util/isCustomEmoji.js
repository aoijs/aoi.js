module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [emoji, guildID = d.guild?.id] = data.inside.splits;
    emoji = emoji.split(":");
    if (emoji.length > 1) {
        emoji = emoji.pop().replace(">", "");
    } else {
        emoji = emoji[0];
    }
    const guild =
        guildID === "global" ? d.client : await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    let isemoji = emoji.trim() === "" ? undefined : guild.emojis.cache.get(emoji);

    data.result = isemoji ? true : false;

    return {
        code: d.util.setCode(data),
    };
};