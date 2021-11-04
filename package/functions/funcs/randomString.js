const { Characters } = require('../../../Utils/Constants.js')
module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [range] = data.inside.splits;

    if (isNaN(range)) return d.aoiError.fnError(d, 'custom', { inside: data.inside });

    let i = 0;

    data.result = '';

    while (i < Number(range)) {
        data.result += Characters.charAt(Math.floor(Math.random() * Characters.length));
    }

    return {
        code: d.util.setCode(data)
    }
}