module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [func] = data.inside.splits;
    if (!d.client.clientShard) return d.aoiError.fnError(d, 'custom', {}, 'ClientShard Class is Not Initialised');

    data.result = await d.client.clientShard.fetchClientValues(func);

    return  {
        code:d.util.setCode(data),
    }
}