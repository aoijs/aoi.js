module.exports = d => {
    const data = d.util.aoiFunc( d ,false);
    data.result = d.client.ws.ping;
    return {
        code: d.util.setCode(data)
    }
} 