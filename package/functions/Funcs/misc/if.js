const { CheckCondition } = require('../../../Utils/helpers/checkCondition.js');
const { mustEscape } = require('../../../Utils/helpers/mustEscape.js');
module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [condition, trueawait, falseawait] = data.inside.splits;

    if (eval(CheckCondition.solve(mustEscape(condition)))) {
        if (trueawait.addBrackets().includes('{execute:')) {
            const cmd = d.client.cmd.awaited.find(x => x.name.toLowerCase() === trueawait.addBrackets().split('{execute:')[1].split('}')[0].toLowerCase());
            if (!cmd) return d.aoiError.fnError(d, "custom", {}, "Invalid Awaited Command: '" + trueawait.addBrackets().split('{execute:')[1].split('}')[0] + "' Provided")
            await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, { data: d.data });
            data.result = trueawait.addBrackets().replace(`{execute:${trueawait.addBrackets().split('{execute:')[1].split('}')[0]}}`, '');
        }
    }
    else {
        if (falseawait.addBrackets().includes('{execute:')) {
            const cmd = d.client.cmd.awaited.find(x => x.name.toLowerCase() === falseawait.addBrackets().split('{execute:')[1].split('}')[0].toLowerCase());
            if (!cmd) d.aoiError.fnError(d, "custom", {}, "Invalid Awaited Command: " + falseawait.addBrackets().split('{execute:')[1].split('}')[0] + " Provided");
            await d.interpreter(d.client, d.message, d.args, cmd, d.client.db, false, undefined, { data: d.data });
            data.result = falseawait.addBrackets().replace(`{execute:${falseawait.addBrackets().split('{execute:')[1].split('}')[0]}}`, '');
        }
    }

    return {
        code: d.util.setCode(data)
    }
}
