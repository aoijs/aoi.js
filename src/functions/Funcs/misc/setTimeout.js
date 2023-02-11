const {Time} = require("../../../utils/helpers/customParser.js");
const {Timeout} = require("../../../utils/helpers/functions.js");

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, duration, timeoutData, returnId = "false", pulse] =
        data.inside.splits;

    const time = isNaN(duration) ? Time.parse(duration)?.ms : Number(duration);
    const pulseEvery = pulse
        ? isNaN(pulse)
            ? Time.parse(pulse)?.ms
            : Number(pulse)
        : undefined;
    const timeoutName = name.trim() === "" ? undefined : name.addBrackets();
    let tdata = {};

    if (timeoutData.addBrackets().startsWith("{")) {
        try {
            tdata = JSON.parse(timeoutData.addBrackets());
        } catch (e) {
            d.aoiError.fnError(d, "custom", {inside: data.inside});
        }
    } else {
        for (let timeData of timeoutData.split("\n")) {
            timeData = timeData.split(":");

            tdata[timeData[0].trim()] = timeData[1].trim();
        }
    }

    const timeout = Timeout(d, name.addBrackets(), time, tdata, pulseEvery);

    if (returnId === "true") {
        data.result = timeout;
    }

    return {
        code: d.util.setCode(data),
    };
};