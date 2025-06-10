/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emojiResolver, guildID = "global"] = data.inside.splits;

    const emoji = await d.util.getEmoji(
        d, 
        emojiResolver, 
        { guild: guildID === "global" ? null : d.util.getGuild(d, guildID) }
    );

    data.result = !!emoji?.id;

    return {
        code: d.util.setCode(data)
    };
};