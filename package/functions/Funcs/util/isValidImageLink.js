const axios = require('axios');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [link] = data.inside.splits;
    let response = false;

    try {
        response = await axios
            .get(inside.inside.addBrackets())
            .then((res) => res.headers["content-type"].startsWith("image"));
    } catch {
        response = false;
    }

    return {
        code: d.util.setCode(data)
    }
}