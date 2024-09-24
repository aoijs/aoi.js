const { Emoji } = require("../core/functions.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = Emoji(d.data.oldEmoji)[option];

    return {
        code: d.util.setCode(data)
    };
};
