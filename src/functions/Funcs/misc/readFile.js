const fs = require('fs');

module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [file, encoding = 'utf8', flag] = data.inside.splits;

    data.result = fs.readFileSync(file.addBrackets(), {
        encoding,
        flag
    }).deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}