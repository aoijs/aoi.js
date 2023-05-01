const { Agent, fetch } = require('undici');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [link] = data.inside.splits;

    const response = await fetch(link.addBrackets(), {
        agent: new Agent(),
        method: 'GET',
    }).catch(() => null);

    data.result = response !== null;

    return {
        code: d.util.setCode(data)
    };
}