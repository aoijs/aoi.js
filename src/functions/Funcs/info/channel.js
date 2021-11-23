const {Channel} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [channelId, option] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);

    const result = Channel(channel)[option];

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}