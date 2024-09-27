const {version} = require('../../package.json');

/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = version;
    return {
        code: d.util.setCode(data)
    }
}