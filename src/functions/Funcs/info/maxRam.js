const os = require('os');

module.exports = d => {
    let {code, result} = d.util.openFunc(d);

    result = (os.totalmem() / 1024 / 1024).toFixed(2);

    return {
        code: d.util.setCode({function: d.func, code, result})
    }
}