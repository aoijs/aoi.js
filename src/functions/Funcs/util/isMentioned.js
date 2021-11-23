module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [opt] = data.inside.splits;

    data.result = (d.mentions[opt] || d.mentions.users.has(opt) || d.mentions.roles.has(opt) || d.mentions.channels.has(opt)) ? true : false;

    return {
        code: d.util.setCode(data)
    }
}