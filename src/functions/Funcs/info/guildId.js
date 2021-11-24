module.exports = d => {
    const data = d.util.openFunc(d);

    const [name = d.guild?.name] = data.inside.splits;

    data.result = d.guild?.name === name ? d.guild?.id : d.client.guilds.cache.find(x => x.name.toLowerCase() === name.addBrackets().toLowerCase());

    return {
        code: d.util.setCode(data)
    }
}