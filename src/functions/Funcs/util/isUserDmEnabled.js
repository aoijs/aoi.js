module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);
    if (!user) return d.aoiError.fnError(d, "user", {inside: data.inside});

    data.result = await user.send(" ").catch(err => err.code);

    data.result = data.result === 50007 ? false : true;

    return {
        code: d.util.setCode(data),
    };
};
