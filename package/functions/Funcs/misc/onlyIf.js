const { CheckCondition } = require('../../../Utils/helpers/checkCondition.js')
const { mustEscape } = require('../../../Utils/helpers/mustEscape.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);
    let error = false;

    const [condition, err] = data.inside.splits;
    const errorMsg = await d.util.errorParser(err, d);

    if (!eval(CheckCondition.solve(mustEscape(condition)))) {
        error = true;
        if(typeof errorMsg.content === 'string' && errorMsg.content.trim() === ''){}
        else  d.aoiError.makeMessageError(d.client, d.channel, errorMsg, errorMsg.options,d);
    }

    return {
        code: d.util.setCode(data),
        error
    }
}