/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [func] = data.inside.splits;
    if (!d.client.shard) return d.aoiError.fnError(d, 'custom', {}, 'ClientShard Class is Not Initialised');

    data.result = await d.client.shard.fetchClientValues(func);

    return {
        code: d.util.setCode(data),
    }
}