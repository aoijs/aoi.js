module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    const [type, ...ids] = inside.splits;
    if (!d.client.blacklist[type]) return d.aoiError.fnError(d, "custom", {inside}, "Invalid Type Provided In");
    if (type === "user") {
        const guildId = ids.shift();
        ids.forEach(id => {
            d.client.blacklist[type].blacklist.add(`${id}_${guildId}`)
        })
    } else {
        d.client.blacklist[type].blacklist.squash(...ids)
    }
    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}