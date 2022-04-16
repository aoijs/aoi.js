module.exports = async d => {
    const {code} = d.util.openFunc(d);

    await d.client.shard.respawnAll();

    return {
        code: d.util.setCode({function: d.func, code})
    }
}