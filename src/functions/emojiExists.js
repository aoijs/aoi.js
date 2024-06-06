module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [emoji] = data.inside.splits;

    try {
        emoji = d.util.getEmoji(d, emoji.addBrackets()).id;
        data.result = true;
    } catch {
        emoji = emoji?.addBrackets() ?? undefined;
    }

    if (data.result === true) {
        data.result = true;
    } else {
        if (!emoji) {
            data.result = false;
        } else {
            const regex = /\p{Extended_Pictographic}/gu;
            data.result = regex.test(emoji);
        }
    }

    return {
        code: d.util.setCode(data)
    };
};
