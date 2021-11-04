const { VoiceState } = require('../../../Utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'name'] = data.inside.splits;

    data.result = VoiceState(d.data.oldVoiceState)[option];

    return {
        code: d.util.openFunc(data)
    }
}