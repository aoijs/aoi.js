module.exports = d => {
    const {code} = d.util.openFunc(d);

    if (!d.client.clientShard) return d.aoiError.fnError(d, 'custom', {}, 'ClientShard Class is Not Initialised');

    d.client.clientShard.respawnAll();

    return {
        code: d.util.setCode({function: d.func, code})
    }
}