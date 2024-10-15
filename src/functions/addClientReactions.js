const { GuildEmoji, ReactionEmoji } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...reactions] = data.inside.splits;

    reactions = await Promise.all(
        reactions.map(async (x) => {
            const reaction = x.addBrackets().trim();
            let emoji = await d.util.getEmoji(d, reaction);
            if (!emoji) emoji = reaction;

            return emoji;
        })
    );

    return {
        code: d.util.setCode(data),
        reactions
    };
};
