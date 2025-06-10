/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [banner] = data.inside.splits;

    d.client.user.setBanner(banner.addBrackets()).catch((err) => {
        d.aoiError.fnError(d, "custom", {}, `Failed To Set Client Banner To "${banner.addBrackets()}" With Reason: ${err}`);
    });

    return {
        code: d.util.setCode(data)
    };
};
