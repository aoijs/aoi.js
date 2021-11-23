const {Time} = require('../../../utils/helpers/customParser.js');
module.exports = async d => {
    const {code, inside, err} = d.util.openFunc(d);
    if (err) return d.error(err);

    let [time] = inside.splits;
    time = Time.parse(time).ms;

    return {
        code: d.util.setCode({function: d.func, code, inside}),
        deleteIn: time
    }
}