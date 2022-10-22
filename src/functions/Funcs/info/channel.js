const {Channel} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [channelID, option] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);

    data.result = Channel(channel)[option];
    return {
        code: d.util.setCode(data)
    }
}