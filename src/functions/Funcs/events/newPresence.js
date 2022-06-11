const {Presence} = require('../../../utils/helpers/functions.js')
module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = Presence(d.data.newPresence)[option];

    return {
        code: d.util.setCode(data)
    }
}