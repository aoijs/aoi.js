const fs = require("fs/promises");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [file, text, encode = "utf8"] = data.inside.splits;

    await fs
        .writeFile(file, text.addBrackets(), {
            encoding: encode,
        })
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Write File With Reason: " + e,
            );
        });
    return {
        code: d.util.setCode(data),
    };
};