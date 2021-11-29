module.exports = async (d) => {
    const code = d.command.code;

    const r = code.split("$getLeaderboardInfo").length - 1;

    const inside = code.split("$getLeaderboardInfo")[r].after();

    const err = d.inside(inside);

    if (err) return d.error(err);

    const [variable, id, type = "user", option = "top"] = inside.splits;

    const res =
        type === "user"
            ? `${id}_${d.guild?.id || 'dm'}`
            : type === "globaluser"
                ? id
                : id;

    const docs = (
        await d.client.db.all(d.client.db.tables[0], variable)
    )
        .filter((e) => e.key.startsWith(`${variable}_`) && (type === 'user' ? e.key.endsWith(`${d.guild?.id || 'dm'}`) : true))
        .sort((x, y) => Number(y.data.value) - Number(x.data.value));

    const ID = `${variable}_` + res;

    const data =
        type === "server"
            ? d.client.guilds.cache.get(id) || {}
            : await d.client.users.fetch(id);

    const options = {
        top: docs.findIndex((e) => e.key === ID) + 1,
        name: type === "server" ? data.name : data.tag,
        value: docs.find((e) => e.key === ID)
            ? docs.find((e) => e.key === ID).data.value
            : 0,
    }[option];

    return {
        code: code.replaceLast(`$getLeaderboardInfo${inside}`, options),
    };
};