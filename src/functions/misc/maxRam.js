const os = require('os');

/**
 * @param {import("..").Data} d
 */
module.exports = d => {
    const data = d.util.aoiFunc(d);

    data.result = (os.totalmem() / 1024 / 1024).toFixed(2);

    return {
        code: d.util.setCode(data)
    }
}