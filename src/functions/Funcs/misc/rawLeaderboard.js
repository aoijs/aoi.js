const {
    AoijsAPI,
    DbdTsDb,
    AoiMongoDb,
    CustomDb,
    Promisify,
} = require("../../../classes/Database.js");

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

    if (!d.client.variableManager.has(variable.addBrackets()))
        return d.aoiError.fnError(
            d,
            "custom",
            {},
            `Variable ${variable.addBrackets()} Not Found!`,
        );

    const idLength = type === "user" ? 2 : 1;
    let y = 0;
    let value;
    let content = [];
    const all = await d.client.db.all(table, variable.addBrackets(), idLength);

    for (const Data of all.sort((x, y) => {
        if (d.client.db instanceof AoijsAPI) {
            if (d.client.db.type === "aoi.db")
                return Number(y.value) - Number(x.value);
            else return Number(y.data.value) - Number(x.data.value);
        } else if (d.client.db instanceof DbdTsDb) {
            return (
                Number(y[variable.addBrackets()]) - Number(x[variable.addBrackets()])
            );
        } else if (d.client.db instanceof AoiMongoDb) {
            return Number(y.value) - Number(x.value);
        } else if (
            d.client.db instanceof CustomDb ||
            d.client.db instanceof Promisify
        ) {
            return (
                Number(
                    y.value ||
                    y[variable.addBrackets()] ||
                    (typeof y.Data === "object" ? y.Data.value : y.Data),
                ) -
                Number(
                    x.value ||
                    x[variable.addBrackets()] ||
                    (typeof x.Data === "object" ? x.Data.value : x.Data),
                )
            );
        }
    })) {
        let user;
        if (d.client.db instanceof AoijsAPI) {
            if (d.client.db.type === "aoi.db") value = Number(Data.value);
            else value = Number(Data.data.value);

            user = await getdata(user, Data, 1);
        } else if (d.client.db instanceof DbdTsDb) {
            value = Number(Data[variable.addBrackets()]);

            user = await getdata(user, Data, 0);
        } else if (d.client.db instanceof AoiMongoDb) {
            value = Number(Data.value);

            user = await getdata(user, Data, 1);
        } else if (
            d.client.db instanceof CustomDb ||
            d.client.db instanceof Promisify
        ) {
            value = Number(
                Data.value ||
                Data[variable.addBrackets()] ||
                (typeof Data.Data === "object" ? Data.Data.value : Data.Data),
            );

            if (Data.key) {
                const arr = Data.key.split("_");
                user = await customarr(arr);
            } else if (Data.id) {
                const arr = Data.id.split("_");
                user = await customarr(arr);
            } else if (Data.ID) {
                const arr = Data.ID.split("_");
                user = await customarr(arr);
            } else if (Data.Id) {
                const arr = Data.Id.split("_");
                user = await customarr(arr);
            } else {
                d.aoiError.fnError(
                    d,
                    "custom",
                    {},
                    "database Not Supported For LeaderBoard",
                );
                break;
            }
        }

        if (user) {
            user =
                typeof user === "object"
                    ? type === "user"
                        ? user.user
                        : user
                    : {id: user};
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
        }
        if (order === "desc") content = content.reverse();

        const px = page * list - list,
            py = page * list;

        data.result = content.slice(px, py).join("\n");

        return {
            code: d.util.setCode(data),
        };
    }

    async function customarr(arr) {
        user =
            (type === "globalUser"
                ? await d.util.getUser(d, arr[1])
                : type === "user"
                    ? await d.util.getMember(d.guild, arr[1])
                    : type === "server"
                        ? await d.util.getGuild(d, arr[1])
                        : arr[1]) ?? arr[1];
        return user;
    }

    async function getdata(user, Data, key) {
        user =
            (type === "globalUser"
                ? await d.util.getUser(d, Data.key.split("_")[key])
                : type === "user"
                    ? await d.util.getMember(d.guild, Data.key.split("_")[key])
                    : type === "server"
                        ? await d.util.getGuild(d, Data.key.split("_")[key])
                        : Data.key.split("_")[key]) ?? Data.key.split("_")[key];
        return user;
    }
};