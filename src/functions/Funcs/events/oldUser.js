const {User} = require('../../../utils/helpers/functions.js')
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = User(d.data.olduser)[option];

    return {
        code: d.util.setCode(data)
    }
}