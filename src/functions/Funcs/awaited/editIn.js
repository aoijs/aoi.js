const {Time} = require("../../../utils/helpers/customParser.js");
module.exports = async (d) => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [time, ...mesgs] = inside.splits;

    time = Time.parse(time).ms;
    const msgs = [];
    mesgs.forEach(async (x) => msgs.push(await d.util.errorParser(x, d)));

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        editIn: {
            time,
            msgs,
        },
    };
};
