const {
    AoijsAPI
} = require("../../classes/Database.js");

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [
        variable,
        type = "asc",
        custom = `{top}. {username}: {value}`,
        list = 10,
        page = 1,
        table = d.client.db.tables[0],
    ] = data.inside.splits;

    const all = await d.client.db.all(table, variable.addBrackets(), 1);

    let y = 0;
    let value;
    let content = [];

    for (const Data of all.sort((x, y) => {
        if (d.client.db instanceof AoijsAPI) {
            if (d.client.db.type === "aoi.db") return Number(y.value) - Number(x.value);

            else return Number(y.data.value) - Number(x.data.value);
        }
    })) {
        let user;

        if (d.client.db instanceof AoijsAPI) {
            if (d.client.db.type === "aoi.db")
                value = Number(Data.value)
            else value = Number(Data.data.value);

            user = await d.util.getUser(d, Data.key.split("_")[1]);
        }

        if (user) {
            y++;

            let text = custom
                .replace(`{top}`, y)
                .replace("{id}", user.id)
                .replace("{tag}", user.tag)
                .replace(`{username}`, user.username.removeBrackets())
                .replace(`{value}`, value);

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0];

                const awaited = d.client.cmd.awaited.find((c) => c.name === ins);

                if (!awaited)
                    return d.aoiError.fnError(
                        d,
                        "custom",
                        {inside: data.inside},
                        ` Invalid awaited command '${ins}' in`,
                    );

                const CODE = await d.interpreter(
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

                text = text.replace(`{execute:${ins}}`, CODE);
            }

            content.push(text);
        }
    }

    if (type === "desc") content = content.reverse();

    const px = page * list - list,
        py = page * list;

    data.result = content.slice(px, py).join("\n");

    return {
        code: d.util.setCode(data),
    };
};