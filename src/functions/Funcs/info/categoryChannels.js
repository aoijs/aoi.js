const {categoryChannelsOption} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);

    const [id, option = "names", sep = " , "] = inside.splits;
    const category = await d.util.getChannel(d, id);
    if (category.type !== d.util.channelTypes.Category) return d.aoiError.fnError(d, "custom", {inside}, "Provided Channel Is Not A Category");

    let result = categoryChannelsOption(category)[option];
    result = Array.isArray(result) ? result.join(sep) : result;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}