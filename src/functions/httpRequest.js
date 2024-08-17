module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    
    let [
        url,
        method = 'get',
        body = ''
    ] = data.inside.splits;

    body = body !== '' ? body.trim() : body;

    // Getting the user-defined headers and content type.
    const headers = {};
    if (d.data.http?.contentType) {
        Object.assign(headers, {
            ['Content-Type']: d.data.http.contentType
        });
    }
    if (d.data.http?.headers) {
        Object.assign(headers, d.data.http.headers);
    }

    // Making the request.
    const response = await fetch(url.addBrackets(), {
        body: body === '' ? undefined : body.addBrackets(),
        headers,
        method
    });

    // Defining response headers.
    (d.data.http??={})["headers"] = {};
    for (const [name, value] of response.headers.entries()) {
        if (/content-type/.test(name)) continue;
        d.data.http.headers[name] = value;
    }

    // Get the response content type.
    const contentType = response.headers.get("content-type")?.split(/;/)[0];

    // Defining response content type.
    (d.data.http ??= {})['contentType'] = contentType;
    d.data.http.statusCode = response.status;

    // Additional response data.
    d.data.http.redirected = response.redirected;
    d.data.http.ok = response.ok;

    // Saving the result.
    if (contentType.match(/application\/json/)) {
        d.data.http.result = await response.json()
    } else if (contentType.match(/image\//)) {
        const buffer = await response.arrayBuffer()
        d.data.http.result = Buffer.from(buffer).toString("base64")
    } else {
        d.data.http.result = await response.text()
    }
    
    return {
        code: d.util.setCode(data),
        data: d.data
    }
}