module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [
        variable,
        order = "asc",
        type = "user",
        custom = "{top}. {name}: {value}",
        list = 10,
        page = 1,
        table = d.client.db.tables[0],
    ] = data.inside.splits;

    if (!d.client.variableManager.has(variable.addBrackets())) return d.aoiError.fnError(d, "custom", {}, `Variable ${variable.addBrackets()} Not Found!`);

    if (!order || (order.toLowerCase() !== "asc" && order.toLowerCase() !== "desc")) return d.aoiError.fnError(d, 'custom', {}, `order must be "desc" or "asc"`)

    let y = 0;
    let value;
    let content = [];
    let all = await d.client.db.all(table, (data) => data.key.startsWith(variable.deleteBrackets()) && data.key.split("_").length === type === "user" ? 3 : 2);

    all = all.sort((x, y) => { return Number(y.value) - Number(x.value)});

    const getdata = async (user, Data, key) => {
        user =
            (type === "globalUser"
                ? await d.util.getUser(d, Data.key.split("_")[key])
                : type === "user"
                ? await d.util.getMember(d.guild, Data.key.split("_")[key])
                : type === "server"
                ? await d.util.getGuild(d, Data.key.split("_")[key])
                : Data.key.split("_")[key]) ?? Data.key.split("_")[key];
        return user;
    };

    for (let i = 0; i < all.length; i++) {
        const Data = all[i];

        let user;

        if (d.client.db.type === "aoi.db") value = Number(Data.value);
        else value = Number(Data.data.value);

        user = await getdata(user, Data, 1);


        if (user) {
            user =
                typeof user === "object"
                    ? type === "user"
                        ? user.user
                        : user
                    : { id: user };
            y++;

            let text = custom
                .replaceAll(`{top}`, y)
                .replaceAll("{id}", user.id)
                .replaceAll("{tag}", user?.tag?.removeBrackets())
                .replaceAll(
                    `{name}`,
                    ["user", "globalUser"].includes(type)
                        ? user.username?.removeBrackets()
                        : user.name?.removeBrackets(),
                )
                .replaceAll(`{value}`, value);

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0];

                const awaited = d.client.cmd.awaited.find(
                    (c) => c.name === ins,
                );

                if (!awaited)
                    return d.aoiError.fnError(
                        d,
                        "custom",
                        { inside: data.inside },
                        ` Invalid awaited command '${ins}' in`,
                    );

                const code = await d.interpreter(
                    d.client,
                    {
                        guild: d.message.guild,
                        channel: d.message.channel,
                        author: user,
                    },
                    d.args,
                    awaited,
                    undefined,
                    true,
                );

                text = text.replace(`{execute:${ins}}`, code);
            }

            content.push(text);
        }
    }

    if (order === "desc") content = content.reverse();

    data.result = content.slice(page * list - list, page * list).join("\n");

    return {
        code: d.util.setCode(data),
    };
};