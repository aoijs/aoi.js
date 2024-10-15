const { GuildEmoji } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    let emojiString = (await d.util.getEmoji(d, emoji.addBrackets()));
    if (!emojiString) emojiString = emoji.toString().addBrackets();

    if (!(emojiString instanceof GuildEmoji)) {
        data.result = true;
    } else {
        const regex = /\p{Extended_Pictographic}/gu;
        data.result = regex.test(emojiId);
    }

    return {
        code: d.util.setCode(data)
    };
};
