const { name } = require('../../../../package.json');

module.exports = d => {
    let { code, result } = d.util.openFunc(d);

    result = name;

    return {
        code: d.util.setCode({ function: d.func, code, result })
    }
}
