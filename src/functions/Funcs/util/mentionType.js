module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [mention] = data.inside.splits;

    mention = mention.replace(/[\\<>#!@&]/g, "");

    data.result = d.mentions.everyone || 'none'

    for (const type of ['users', 'channels', 'members', 'roles', 'crosspostedChannels']) {
        if (d.mentions[type].has(mention)) {
            data.result = type;
            break;
        }
    }

    return {
        code: d.util.setCode(data)
    }
}