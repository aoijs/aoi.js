const { abbreviate } = require("../../utils/helpers/functions.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [num, dec = 0] = data.inside.splits;
    const n = Number(num);
    const de = Number(dec);

    if (isNaN(n) || isNaN(de)) {
        return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            `${
                isNaN(n)
                    ? "Invalid Number in "
                    : isNaN(de)
                        ? "Invalid Decimal Position in"
                        : ""
            }`
        );
    }

    let a;
    try {
        a = abbreviate(n, de);
    } catch (e) {
        return d.aoiError.fnError(d, "custom", {}, e);
    }

    data.result = a;
    return {
        code: d.util.setCode(data),
    };
};
