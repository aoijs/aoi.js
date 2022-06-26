const {Time} = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [ms] = data.inside.splits;
    const time = isNaN(ms) ? Time.parse(ms)?.ms : Number(ms);

    data.result = Time.digital(time);

    return {
        code: d.util.setCode(data),
    };
};
