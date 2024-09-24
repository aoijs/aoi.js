const { Message } = require("../core/functions.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "cleanContent"] = data.inside.splits;
    data.result = eval(`Message(d.data.oldMessage)?.${option}`);

    return {
        code: d.util.setCode(data)
    };
};
