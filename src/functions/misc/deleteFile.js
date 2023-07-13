const fs = require("fs/promises");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [file] = data.inside.splits;

    await fs
        .unlink(file)
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Delete File With Reason: " + e,
            );
        });
    return {
        code: d.util.setCode(data),
    };
};