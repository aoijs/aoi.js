/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const reactions = data.inside.splits;

    for (let i = reactions.length - 1; i >= 0; i--) {
        const raw = reactions[i].trim();
        const content = raw.includes("$") ? raw.addBrackets() : raw;

        const emoji = await d.util.getEmoji(d, content) || content;

        await d.message.react(emoji).catch((err) =>
            d.aoiError.fnError(
                d,
                "custom",
                {},
                `Failed to react with "${raw}": ${err.message}`
            )
        );
    }

    return {
        code: d.util.setCode(data)
    };
};
