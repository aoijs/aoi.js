const {MemberOptions} = require('../../../utils/Constants.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [option = 'name'] = data.inside.splits;

    const Opx = MemberOptions[option];
    data.result = eval(`d.data.newm?.${Opx}`);

    return {
        code: d.util.setCode(data)
    }
}