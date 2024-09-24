const Interpreter = require("../core/interpreter.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, split, awaits, sep = ' , '] = data.inside.splits;

    const arr = text.addBrackets().split(split.addBrackets());
    const res = [];

    const cmd = d.client.cmd.awaited.find(x => x.name.toLowerCase() === awaits.addBrackets().toLowerCase());
    if (!cmd) returnd.aoiError.fnError(d, 'custom', {inside: data.inside}, `Coundn't Find AwaitedCommand: ${awaits} In`);

    arr.forEach(async x => {
        const code = cmd.code.replaceAll('{value}', x);
        const command = {...cmd, code}

        res.push((await Interpreter(d.client, d.message, d.args, command, d.client.db, true))?.code);
    });

    data.result = res.join(sep.addBrackets()).deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}