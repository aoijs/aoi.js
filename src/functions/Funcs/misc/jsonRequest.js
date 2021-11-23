const axios = require('axios');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

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

    let res = await axios.get(link.addBrackets(), {
        headers: headers
    }).catch(async e => {
        if (!error || error === '$default') return d.aoiError.fnError(d, 'custom', {}, 'Failed To Request To API With Reason: ' + e);
        else {
            const jsonError = await d.util.errorParser(error, d);
            d.aoiError.makeMessageError(d.client, d.channel, jsonError, jsonError.options);
        }
    });

    res = res?.data;

    if (typeof res === 'object') {
        data.result = (property?.trim() === '') ? JSON.stringify(res, null, 2) : eval(`res?.${property?.addBrackets()}`);
    }
    return {
        code: d.util.setCode(data)
    }
}
