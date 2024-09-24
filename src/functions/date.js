const { FormatOptions } = require("../utils/Constants");

/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const date = new Date(new Date().toLocaleString('en-us', { timeZone: d.timezone }));
    const formattedOptions = FormatOptions(date);

    data.result = formattedOptions.DD;

    return {
        code: d.util.setCode(data)
    };
};
