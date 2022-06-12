module.exports = async d => {
    const data = d.util.aoiFunc(d);

    data.result = await d.client.shard.respawnAll();
    return {
        code: d.util.setCode(data)
    }
}