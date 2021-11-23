const axios = require('axios');

module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [link] = data.inside.splits;

    let res = await axios.get(link.addBrackets()).catch(e => undefined);

    data.result = res ? true : false;

    return {
        code: d.util.setCode(data)
    }
}