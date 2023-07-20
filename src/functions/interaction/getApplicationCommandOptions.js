module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [name, type = 'global'] = data.inside.splits;

    if (type === 'global') {
        const all = await d.client.application.commands.fetch();

        data.result = JSON.stringify(all.find(x => x.name === name.addBrackets().toLowerCase())?.options, null, 2);
    } else {
        const guild = await d.util.getGuild(d, type);
        if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

        const all = await guild.commands.fetch();

        data.result = JSON.stringify(all.find(x => x.name === name.addBrackets().toLowerCase())?.options, null, 2);
    }

    return {
        code: d.util.setCode(data)
    }
}
