module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [...reactions] = data.inside.splits;

    reactions = reactions.map(x => x.addBrackets()).reverse();

    data.result = ""

    return {
        code: d.util.setCode(data),
        reactions,
    };
};
