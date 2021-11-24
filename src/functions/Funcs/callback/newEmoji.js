const {Emoji} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'name'] = data.inside.splits;

    data.result = Emoji(d.data.newe)[option];

    return {
        code: d.util.setCode(data)
    }
}