const {Invite} = require('../../../utils/helpers/functions.js');


module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [option] = data.inside.splits;

    data.result = Invite(d.data.invite)?.[option].deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}