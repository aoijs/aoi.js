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
            const regex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F680}-\u{1F6FF}\u{24C2}-\u{1F251}\u{1F600}-\u{1F64F}]/u;
            data.result = regex.test(emoji);
        }
    }

    return {
        code: d.util.setCode(data)
    };
};
