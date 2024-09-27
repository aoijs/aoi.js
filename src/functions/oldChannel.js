const { ChannelOptions } = require("../utils/Constants.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = ChannelOptions[option](d.data?.oldChannel, d.data?.newChannel);

    return {
        code: d.util.setCode(data)
    };
};
