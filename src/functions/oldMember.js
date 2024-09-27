const { MemberOptions } = require("../utils/Constants.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = MemberOptions[option](d.data?.oldMember, d.data?.newMember);

    return {
        code: d.util.setCode(data)
    };
};
