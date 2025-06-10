/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    data.result = await d.channel.sendTyping();

    return {
        code: d.util.setCode(data),
    };
};
