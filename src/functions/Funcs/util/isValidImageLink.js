const { Agent, fetch } = require('undici');

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    if (data.err) {
        return d.error(data.err);
    }

    const [link] = data.inside.splits;

    try {
        const response = await fetch(data.inside.inside.addBrackets(), {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            },
            agent: new Agent(),
            signal: null, // Allows the request to be aborted if necessary
            timeout: 5000 // Add a timeout to prevent waiting indefinitely
        });

        const contentType = response.headers.get('content-type');
        data.result = contentType && contentType.startsWith('image');
    } catch (error) {
        console.error(error);
        return d.error("An error occurred while processing your request.");
    }

    return {
        code: d.util.setCode(data),
    };
};
