/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...words] = data.inside.splits;

    const returnRandom = words[0] == "true";
    if (returnRandom) words.shift();

    let randomWord = words[Math.floor(Math.random() * words.length)];

    if (returnRandom) {
        data.result = randomWord;
    } else {
        const randoms = d.randoms;
        if (!randoms[`randomText${data.inside}`]) {
            randoms[`randomText${data.inside}`] = randomWord;
        } else {
            randomWord = randoms[`randomText${data.inside}`];
        }

        data.result = randomWord;
    }

    return {
        code: d.util.setCode(data)
    };
};
