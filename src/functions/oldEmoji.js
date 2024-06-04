const { Emoji } = require("../core/functions.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "name"] = data.inside.splits;

    data.result = Emoji(d.data.oldEmoji)[option];

    return {
        code: d.util.setCode(data)
    };
};
