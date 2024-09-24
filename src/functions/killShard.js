/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [shardId = 0] = data.inside.splits;

    await d.client.shard.broadcastEval(c => {
        if (c.shard.ids.includes(Number(shardId))) process.exit();
    });

    return {
        code: d.util.setCode(data)
    }
}