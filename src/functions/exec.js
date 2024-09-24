const cld = require('child_process');
/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    try {
        data.result = cld.execSync(data.inside.inside?.addBrackets()).toString();
    } catch (e) {
        data.result = e
    }

    return {
        code: d.util.setCode(data)
    }
} 