const fs = require("fs/promises");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [file, encoding = "utf8", flag] = data.inside.splits;

    data.result = await fs
        .readFile(file.addBrackets(), {
            encoding,
            flag,
        })
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Read File With Reason: " + e,
            );
        });
    data.result = data.result.deleteBrackets();
    return {
        code: d.util.setCode(data),
    };
};