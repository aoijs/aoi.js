const { ReactionOptions } = require("../utils/Constants");
/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    const reactionData = ReactionOptions[option](d.data.reactionData);

    data.result = reactionData ?? null;

    return {
        code: d.util.setCode(data)
    };
};
