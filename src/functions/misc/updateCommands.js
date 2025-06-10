/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [ all = "true" ] = data.inside.splits;

    if (!d.client.loader) return d.aoiError.fnError(d, 'custom', {}, 'LoadCommands Class Is Not Initiated');

    if (d.client.shard && all === "true") {
        await d.client.shard.broadcastEval(async client => {
            if (client.loader) {
                await client.loader.update();
            }
        });
    } else {
        await d.client.loader.update();
    }

    return {
        code: d.util.setCode(data)
    }
}