module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channel] = data.inside.splits;
    try {
  channel = d.client.channels.cache.find(x => x.name.toLowerCase() === channel.toLowerCase().addBrackets() || x.id === channel)
    data.result = !!channel
} catch (error) {
  data.result = false;
}
    return {
        code: d.util.setCode(data)
    }
}
