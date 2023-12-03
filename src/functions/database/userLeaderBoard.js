module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [
        guildID = d.guild?.id,
        variable,
        type = "asc",
        custom = `{top}. {username}: {value}`,
        list = 10,
        page = 1,
        table = d.client.db.tables[0],
    ] = data.inside.splits;

    let all = await d.client.db.all(
        table,
        (data) =>
            data.key.startsWith(variable.deleteBrackets()) &&
            data.key.split("_").length === 3 &&
            data.key.split("_")[2] === guildID,
    );

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

    let value;
    let content = [];

    const px = (page-1) * list,
        py = page * list;

       all = all.sort((x, y) => {
        if (d.client.db.type === "aoi.db")
            return Number(y.value) - Number(x.value);
        else return Number(y.data.value) - Number(x.data.value);
    });
    all = all.slice(px, py);
    let y = px+1;

    for (const Data of all  ) {
        let user;

        if (d.client.db.type === "aoi.db") value = Number(Data.value);
        else value = Number(Data.data.value);

        user = await d.util.getMember(guild, Data.key.split("_")[1]);

        let text = custom
            .replaceAll(`{top}`, y)
            .replaceAll("{id}", user.user.id)
            .replaceAll("{tag}", user.user.tag)
            .replaceAll(`{username}`, user.user.username.removeBrackets())
            .replaceAll(`{value}`, value);

        if (text.includes("{execute:")) {
            let ins = text.split("{execute:")[1].split("}")[0];

            const awaited = d.client.cmd.awaited.find((c) => c.name === ins);

            if (!awaited)
                return d.aoiError.fnError(
                    d,
                    "custom",
                    { inside: data.inside },
                    ` Invalid awaited command '${ins}' in`,
                );

            const CODE = await d.interpreter(
                d.client,
                {
                    guild: guild,
                    channel: d.message.channel,
                    author: user,
                },
                d.args,
                awaited,
                undefined,
                true,
            );

            text = text.replace(`{execute:${ins}}`, CODE);
        }

        content.push(text);
        y++;
    }

    if (type === "desc") content = content.reverse();

    data.result = content.slice(px, py).join("\n");

    return {
        code: d.util.setCode(data),
    };
};
