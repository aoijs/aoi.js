const {Client} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err)

    const [option] = inside.splits;

    const result = eval(`Client(d.client).${option}`) ?? "";

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}