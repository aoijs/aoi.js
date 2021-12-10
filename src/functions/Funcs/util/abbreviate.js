const {abbreviate} = require("../../../utils/helpers/functions.js");
module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    const [num, dec = 0] = inside.splits;
    const n = Number(num);
    const de = Number(dec);
    if (isNaN(n) || isNaN(de))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            `${
                isNaN(n)
                    ? "Invalid Number in "
                    : isNaN(d)
                        ? "Invalid Decimal Position in"
                        : ""
            }`,
        );
    let a;
    try {
        a = abbreviate(n, de);
    } catch (e) {
        return d.aoiError.fnError(d, "custom", {}, e);
    }
    return {
        code: d.util.setCode({function: d.func, code, inside, result: a}),
    };
};
