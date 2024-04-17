const { FormatOptions } = require("../../utils/Constants");

module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    const date = new Date(new Date().toLocaleString("en-us", { timeZone: d.timezone }));
    const formattedOptions = FormatOptions(date);

    data.result = formattedOptions.HH;

    return {
        code: d.util.setCode(data)
    };
};
