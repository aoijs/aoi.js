const {categoryChannelsOption} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [id, option = "names", sep = " , "] = data.inside.splits;
    const category = await d.util.getChannel(d, id);
    if (category.type !== d.util.channelTypes.Category) return d.aoiError.fnError(d, "custom", {inside}, "Provided Channel Is Not A Category");
  
    data.result = categoryChannelsOption(category)[option];

    data.result = Array.isArray(data.result) ? data.result.join(sep)
      : data.result;

    return {
        code: d.util.setCode(data)
    }
}