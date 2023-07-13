module.exports = d => {
    const data = d.util.aoiFunc(d);

   data.result = d.client.guilds.cache.size;

    return {
        code: d.util.setCode(data)
    }
}