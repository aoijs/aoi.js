module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [name] = data.inside.splits;

    data.result = name ? d.client.channels.cache.find(x => x.name.toLowerCase() === name.toLowerCase().addBrackets())?.id : d.channel?.id;
    return {
        code: d.util.setCode(data)
    }
}