const {Emoji} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [option = 'name'] = data.inside.splits;

    data.result = Emoji(d.data.olde)[option];

    return {
        code: d.util.setCode(data)
    }
}