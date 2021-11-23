const {User} = require('../../../utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, option = 'username'] = data.inside.splits;

    const user = await d.util.fetchUser(d, userId);
    if (!user) return d.aoiError.fnError(d, 'user', {inside: data.inside});

    data.result = User(user)[option];

    return {
        code: d.util.setCode(data)
    }
}