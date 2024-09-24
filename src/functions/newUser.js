const { User } = require("../core/functions.js");

/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = User(d.data.newUser)[option];

    return {
        code: d.util.setCode(data)
    };
};
