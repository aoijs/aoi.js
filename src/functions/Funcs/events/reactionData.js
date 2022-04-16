const {Emoji} = require('../../../utils/helpers/functions.js');
module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = "name"] = data.inside.splits;

    const reactionData = Emoji(d.data.reactionData.emoji);
    reactionData.usernames = d.data.reactionData.users.cache.map(y => y.username.deleteBrackets()).join(" , ");
    reactionData.userIds = d.data.reactionData.users.cache.map(y => y.id).join(" , ");
    reactionData.tags = d.data.reactionData.users.cache.map(y => y.tag.deleteBrackets()).join(" , ");

    data.result = reactionData?.[option].deleteBrackets();

    return {
        code: d.util.setCode(data)
    }
}