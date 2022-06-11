module.exports = d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...cmds] = data.inside.splits;

    d.client.blacklist.commands.push(...cmds);

    return {
        code: d.util.setCode(data)
    }
}