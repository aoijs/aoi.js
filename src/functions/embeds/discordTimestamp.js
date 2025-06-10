/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [timestamp = Date.now(), flag = "F"] = data.inside.splits;

    if (!["f", "d", "t", "F", "D", "T", "R"].includes(flag)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid flag Provided In");

    data.result = `<t:${Math.floor(timestamp / 1000)}:${flag}>`;

    return {
        code: d.util.setCode(data)
    };
};
