const {Characters} = require("../../../utils/Constants.js");
module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [range, diffExec = "no"] = data.inside.splits;

    if (isNaN(range))
        return d.aoiError.fnError(d, "custom", {inside: data.inside});

    let i = 0;
    data.result = '';
    const randoms = d.randoms;

    if (randoms[`randomString${data.inside}`])
        data.result = randoms[`randomString${data.inside}`];
    else if (diffExec === "yes") {
        while (i < Number(range)) {
            data.result += Characters.charAt(
                Math.floor(Math.random() * Characters.length),
            );
            i++;
        }
        d.randoms[
            `$randomString${data.inside}${Math.floor(Math.random() * 999999)}`
            ] = data.result;
    } else {
        while (i < Number(range)) {
            data.result += Characters.charAt(
                Math.floor(Math.random() * Characters.length),
            );
            i++;
        }
        d.randoms[`$randomString${data.inside}`] = data.result;
    }
    return {
        code: d.util.setCode(data),
    };
};
