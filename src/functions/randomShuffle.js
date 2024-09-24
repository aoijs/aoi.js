/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    let [...texts] = data.inside.splits;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    data.result = shuffle(texts)[Math.floor(Math.random() * texts.length)]
    return {
        code: d.util.setCode(data),
    };
}