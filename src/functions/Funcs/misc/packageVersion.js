const {version} = require('../../../../package.json');

module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = version;

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}