const { Time } = require("../core/Time.js");
const { Timeout } = require("../core/functions.js");

/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, duration, timeoutData, returnID = "false"] = data.inside.splits;

    if (!name) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Timeout Name Provided");

    const time = isNaN(duration) ? Time.parse(duration)?.ms : Number(duration);
    let tdata = {};

    if (timeoutData.addBrackets().startsWith("{")) {
        try {
            tdata = JSON.parse(timeoutData.addBrackets());
        } catch (e) {
            d.aoiError.fnError(d, "custom", { inside: data.inside });
        }
    } else {
        for (let timeData of timeoutData.split("\n")) {
            timeData = timeData.split(":");

            tdata[timeData[0].trim()] = timeData[1].trim();
        }
    }

    const timeout = Timeout(d, name.addBrackets(), time, tdata);

    if (returnID === "true") {
        data.result = timeout;
    }

    return {
        code: d.util.setCode(data)
    };
};
