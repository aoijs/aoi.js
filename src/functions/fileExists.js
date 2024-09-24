const {existsSync} = require('fs');
/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) d.error(data.err);

    const [path] = data.inside.splits;
    data.result = existsSync(path);

    return {
        code: d.util.setCode(data)
    }
}