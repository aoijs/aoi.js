const axios = require('axios');

module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [url, method = "get", body = '', property, error = '$default', ...header] = data.inside.splits;

    body = body?.trim() === '' ? undefined : JSON.parse(body);
    let headers;
    if (header.length === 1) {
        try {
            headers = JSON.parse(header);
        } catch (e) {
            header.forEach(x => {
                const split = x.split(':');
                headers[split[0]] = split[1];
            });
        }
    }

    const req = await axios({
        method,
        url: url.addBrackets(),
        headers,
        data: body,
        responseType: 'text'
    }).catch(async e => {
        console.error(e)
        if (error === "$default" || !error) {
            return d.aoiError.makeMessageError(d.client, d.channel, {content: e}, {}, d)
        } else {
            error = await d.util.errorParser(error, d);
            return d.aoiError.makeMessageError(d.client, d.channel, error, error.options, d)
        }
    });
    const res = req?.data;
    data.result = property ? eval(`res?.${property}`) : JSON.stringify(res, null, 2);

    return {
        code: d.util.setCode(data)
    }
}