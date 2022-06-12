module.exports = d => {
    const data = d.util.aoiFunc(d);

    const [name = d.guild?.name] = data.inside.splits;

    data.result = d.guild?.name === name ? d.guild?.id : d.client.guilds.cache.find(x => x.name.toLowerCase() === name.addBrackets().toLowerCase())?.id;
    return {
        code: d.util.setCode(data)
    }
}