const { MemberOptions } = require('../../../Utils/Constants.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'name'] = data.inside.splits;

    const Opx = ChannelOptions[option];
    data.result = eval(`d.data.newm?.${Opx}`);

    return {
        code: d.util.openFunc(data)
    }
}