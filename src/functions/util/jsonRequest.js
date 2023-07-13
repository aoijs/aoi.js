const { Agent, fetch } = require('undici');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) {
        return { error: data.err };
    }

    const [link, property = '', error, ...heads] = data.inside.splits;
    let headers;

    if (heads.length === 0) headers = {};
    else if (heads.length >= 1) {
        try {
            headers = JSON.parse(heads[0].addBrackets());
        } catch (e) {
            for (let head of heads) {
                head = head.split(':');

                headers[head[0].addBrackets()] = head[1].addBrackets()
            }
        }
    }

    let res = await fetch(link.addBrackets(), {
        method: 'GET',
        headers: headers,
        agent: new Agent()
    }).catch(async e => {
        if (!error || error === '$default') {
            return { error: `Failed To Request To API With Reason: ${e}` };
        } else {
            const jsonError = await d.util.errorParser(error, d);
            await d.aoiError.makeMessageError(d.client, d.channel, jsonError.data ?? jsonError, jsonError.options);
            return { error: `Failed To Request To API With Reason: ${e}` };
        }
    });

    res = await res.text();

    try {
        data.result = (property?.trim() === '') ? JSON.stringify(JSON.parse(res), null, 2) : eval(`JSON.parse(res)?.${property?.addBrackets()}`);
    } catch (e) {
        data.result = res;
    }

    return {
        code: d.util.setCode(data)
    };
}