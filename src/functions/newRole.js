const { Role } = require("../core/functions.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = Role(d.data.newRole)[option];

    return {
        code: d.util.setCode(data)
    };
};
