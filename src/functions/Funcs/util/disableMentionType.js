module.exports = async d => {
    const data = d.util.openFunc(d);

    const [type = 'all'] = data.inside.splits;
    if (!['everyone', 'users', 'roles', 'all'].includes(type)) d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid Type Provided In');

    d.disableMentions
}