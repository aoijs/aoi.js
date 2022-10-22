const {User} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [userID = d.author?.id, option = 'username'] = data.inside.splits;

    const user = await d.util.fetchUser(d, userID);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = User(user)[option];

    return {
        code: d.util.setCode(data)
    }
}