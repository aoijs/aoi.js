/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    let evaled;

    try {
        evaled = await eval(`d.data.interaction?.${data.inside.addBrackets()}`);
        data.result = typeof evaled === "object" ? require('util').inspect(evaled, {depth: 0}).deleteBrackets() : typeof evaled === "string" ? evaled.deleteBrackets() : evaled;
    } catch (e) {
        data.result = "undefined"
    }

    return {
        code: d.util.setCode(data)
    }
} 