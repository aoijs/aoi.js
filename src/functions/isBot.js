/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id] = data.inside.splits;

    const user = await d.util.getUser(d, userID);

    data.result = !!user?.bot;

    return {
        code: d.util.setCode(data),
    };
};
