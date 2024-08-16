module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const data = d.util.aoiFunc(d);
    const [command, type, ...id] = data.inside.splits;
    const types = {
        globalUser: id[0] || d.message.author.id,
        user: `${id[0] || d.message.author.id}_${id[1] || d.message.guild.id || "dm"}`,
        guild: id[0] || d.message.guild.id,
        channel: id[0] || d.message.channel.id
    };
    if (!types[type]) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid Type In");
    if (await d.client.db.get("__aoijs_vars__", "cooldown", command + "_" + types[type])) {
        await d.client.db.delete("__aoijs_vars__", "cooldown", command + "_" + types[type]);
    } else {
        d.aoiError.fnError(d, "custom", {}, "No Such Cooldown Exists");
    }
    return {
        code: d.util.setCode(data)
    };
};
