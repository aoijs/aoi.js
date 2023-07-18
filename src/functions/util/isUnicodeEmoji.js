module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [emoji] = data.inside.splits;

    const extendedPictographicRegex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F680}-\u{1F6FF}\u{24C2}-\u{1F251}]/u;
    data.result = extendedPictographicRegex.test(emoji);

    return {
        code: d.util.setCode(data)
    };
};
