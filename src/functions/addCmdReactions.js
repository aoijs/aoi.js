/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...reactions] = data.inside.splits;
    reactions = reactions.reverse();

    for (let i = reactions.length - 1; i >= 0; i--) {
        let reaction;
        reaction = await d.util.getEmoji(d, reactions[i].addBrackets().trim());
        if (!reaction) reaction = reactions[i].addBrackets().trim();
        await d.message.react(reaction).catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
    }

    return {
        code: d.util.setCode(data)
    };
};
