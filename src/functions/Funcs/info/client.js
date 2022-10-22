const {Client} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [option] = data.inside.splits;

    data.result = eval(`Client(d.client).${option}`) ?? "";
    return {
        code: d.util.setCode(data)
    }
}