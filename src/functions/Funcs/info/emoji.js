const {Emoji} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    let [emoji, option] = inside.splits;

    emoji = await d.util.getEmoji(d, emoji.addBrackets());
    if (!emoji) return d.aoiError.fnError(d, "emoji", {inside});
    let result = Emoji(emoji)[option];

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
} 