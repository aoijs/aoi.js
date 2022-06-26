const {Message} = require("../../../utils/helpers/functions.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "cleanContent"] = data.inside.splits;
    data.result = eval(`Message(d.data.oldm)?.${option}`);

    return {
        code: d.util.setCode(data),
    };
};
