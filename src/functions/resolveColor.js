const {Util} = require("discord.js");
const {RBGtoHex} = require("../core/functions.js");
/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [type, returnAs = "number", ...datas] = data.inside.splits;

    if (returnAs === "number") {
        data.result = Util.resolveColor(datas.length === 1 ? datas[0] : datas);
    } else {
        if (type === "decimal") {
            if (datas.length !== 1)
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {inside: data.inside},
                    "Invalid Number Of Fields Provided In",
                );

            data.result = "#" + Number(datas[0]).toString(16);
        } else if (type === "rgb") {
            if (!datas.every((x) => isNaN(x) === false))
                return d.aoiError.fnError(
                    d,
                    "custom",
                    {inside: data.inside},
                    "Invalid Number Provided In",
                );

            data.result = RBGtoHex(...datas.map((x) => Number(x)));
        }
    }

    return {
        code: d.util.setCode(data),
    };
};