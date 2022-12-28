module.exports = async (d) => {
    const code = d.command.code;

    const Data = d.util.aoiFunc( d );
    if( Data.error ) return d.error( Data.error );
    const [variable, id, type = "user", option = "top"] = Data.inside.splits;

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
    Data.result = options;
    return {
        code: d.util.setCode(Data),
    }
};