module.exports = async (d) => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userId);

    data.result = user?.bot ? true : false;

    return {
        code: d.util.setCode(data),
    };
};
