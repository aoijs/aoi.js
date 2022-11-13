const {PinData} = require("../../../utils/EventUtil.js");
module.exports = d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    const [option] = inside.splits;

    const result = PinData(d)[option].deleteBrackets();

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}