const { DataResolver } = require("discord.js");

module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [...words] = data.inside.splits;

    data.result = words[Math.floor(Math.random() * words.length)];
    const randoms = d.randoms;
    if (!randoms['randomText']) {
        randoms['randomText'] = data.result;
    }
    else {
        data.result = randoms['randomText'];
    }

    return {
        code: d.util.setCode(data)
    }
}