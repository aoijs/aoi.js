module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);

    data.result = user?.bot ? true : false;

    return {
        code: d.util.setCode(data),
    };
};
