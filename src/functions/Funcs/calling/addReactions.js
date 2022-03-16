module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [...reactions] = inside.splits;

    reactions = reactions.map(x => x.addBrackets()).reverse();

    return {
        code: d.util.setCode({function: d.func, code, inside, result: ""}),
        reactions,
    };
};
