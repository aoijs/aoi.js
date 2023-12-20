const { Agent, fetch } = require('undici');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [url, method = 'get', body = '', property, error = 'default', ...header] =
        data.inside.splits;

    body = body?.trim() === '' ? undefined : body
    let headers = {};
    if (header.length === 1) {
        try {
            headers = JSON.parse(header);
        } catch (e) {
            header.forEach((x) => {
                const split = x.split(':');
                headers[split[0]] = split[1];
            });
        }
    } else if (header.length > 1) {
        header.forEach((x) => {
            const split = x.split(':');
            headers[split[0]] = split[1];
        });
    }

    try {
        const response = await fetch(url.addBrackets(), {
            method,
            headers,
            body,
            agent: new Agent(),
        });

        const responseBody = await response.text();
        data.result = property
            ? eval(`JSON.parse(responseBody)?.${property}`)
            : responseBody;
    } catch (err) {
        console.error(err);
        if (error === 'default') {
            return d.aoiError.makeMessageError(
                d.client,
                d.channel,
                { content: err },
                {},
                d
            );
        } else {
            const parsedError = await d.util.errorParser(error, d);
            return d.aoiError.makeMessageError(
                d.client,
                d.channel,
                parsedError.data ?? parsedError,
                parsedError.options,
                d
            );
        }
    }

    return {
        code: d.util.setCode(data),
    };
};
