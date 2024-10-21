const { Agent, fetch } = require('undici');

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    
    let [
        url,
        method = "get",
        body = "",
        encoding = "utf-8",
        name = "res"
    ] = data.inside.splits;

    // Creating the aoijs response object.
    d.requests[name] ??= {};

    body = body !== "" ? body.trim() : d.requests[name].body !== undefined ? d.requests[name].body : body;

    // Getting the user-defined headers.
    const headers = {};
    if (d.requests[name].headers) {
        Object.assign(headers, d.requests[name].headers);
    }

    // Making the request.
    const response = await fetch(url.addBrackets(), {
        body: body === "" ? undefined : body.addBrackets(),
        headers,
        method,
        credentials: d.requests[name]?.credentials
    });

    // Defining response headers.
    (d.requests[name]??={})["headers"] = {};
    for (const [headerName, value] of response.headers.entries()) {
        d.requests[name].headers[headerName] = value;
    }

    // Get the response content type.
    const contentType = response.headers.get("content-type")?.split(/;/)[0];

    // Defining response content type.
    d.requests[name].statusCode = response.status;

    // Additional response data.
    d.requests[name].redirected = response.redirected;
    d.requests[name].ok = response.ok;

    // Saving the result.
    if (contentType.match(/application\/json/)) {
        d.requests[name].result = await response.json()
    } else if (contentType.match(/image\//)) {
        d.requests[name].result = await response.arrayBuffer()
        .then(a => Buffer.from(a).toString(encoding));
    } else {
        d.requests[name].result = await response.text()
    }
    
    return {
        code: d.util.setCode(data),
        requests: d.requests
    }
}