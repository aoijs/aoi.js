const {AoijsAPI, DbdTsDb, AoiMongoDb, CustomDb, Promisify} = require("../../../classes/Database.js");

module.exports = async d => {
    const Data = d.util.openFunc(d);
    if (Data.err) return d.error(Data.err);

    const [variable, order = 'asc', type = 'user', custom = '{top}. {name}: {value}', list = 10, page = 1, table = d.client.db.tables[0]] = Data.inside.splits;

    if (!d.client.variableManager.has(variable.addBrackets())) return d.aoiError.fnError(d, 'custom', {}, `Variable ${variable.addBrackets()} Not Found!`);

    const idLength = type === 'user' ? 2 : 1;
    let y = 0
    let value;
    let content = []
    const all = await d.client.db.all(table, variable.addBrackets(), idLength);

    for (const data of all.sort((x, y) => {
        if (d.client.db instanceof AoijsAPI) {
            return (Number(y.data.value) - Number(x.data.value))
        } else if (d.client.db instanceof DbdTsDb) {
            return (Number(y[variable.addBrackets()]) - Number(x[variable.addBrackets()]));
        } else if (d.client.db instanceof AoiMongoDb) {
            return (Number(y.value) - Number(x.value))
        } else if (d.client.db instanceof CustomDb || d.client.db instanceof Promisify) {
            return (Number(y.value || y[variable.addBrackets()] || (typeof y.data === 'object' ? y.data.value : y.data)) - Number(x.value || x[variable.addBrackets()] || (typeof x.data === 'object' ? x.data.value : x.data)))
        }
    })) {
        let user;
        if (d.client.db instanceof AoijsAPI) {
            value = Number(data.data.value);

            user = await getData(user, data, 1);
        } else if (d.client.db instanceof DbdTsDb) {
            value = Number(data[variable.addBrackets()]);

            user = await getData(user, data, 0);
        } else if (d.client.db instanceof AoiMongoDb) {
            value = Number(data.value)

            user = await getData(user, data, 1)
        } else if (d.client.db instanceof CustomDb || d.client.db instanceof Promisify) {
            value = Number(data.value || data[variable.addBrackets()] || (typeof data.data === 'object' ? data.data.value : data.data))

            if (data.key) {
                const arr = data.key.split('_');
                user = await customarr(arr)
            } else if (data.id) {
                const arr = data.id.split('_');
                user = await customarr(arr)
            } else if (data.ID) {
                const arr = data.ID.split('_');
                user = await customarr(arr)
            } else if (data.Id) {
                const arr = data.Id.split('_');
                user = await customarr(arr)
            } else {
                d.aoiError.fnError(d, 'custom', {}, 'Database Not Supported For LeaderBoard')
                break;
            }
        }

        if (user) {
            user = typeof user === 'object' ? (type === 'user' ? user.user : user) : {id: user};
            y++

            let text = custom.replaceAll(`{top}`, y).replaceAll("{id}", user.id).replaceAll("{tag}", user?.tag?.removeBrackets()).replaceAll(`{name}`, ['user', 'globalUser'].includes(type) ? user.username?.removeBrackets() : user.name?.removeBrackets()).replaceAll(`{value}`, value)

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0]

                const awaited = d.client.cmd.awaited.find(c => c.name === ins)

                if (!awaited) return d.aoiError.fnError(d, 'custom', {inside: Data.inside}, ` Invalid awaited command '${ins}' in`)

                const CODE = await d.interpreter(d.client, {
                    guild: guild,
                    channel: d.message.channel,
                    author: user
                }, d.args, awaited, undefined, true)

                text = text.replace(`{execute:${ins}}`, CODE)
            }

            content.push(text)
        }
        if (order === "desc") content = content.reverse()

        const px = page * list - list, py = page * list

        Data.result = content.slice(px, py).join("\n");

        return {
            code: d.util.setCode(Data)
        }
    }

    async function customarr(arr) {
        user = (type === 'globalUser' ? await d.util.getUser(d, arr[1]) : type === 'user' ? await d.util.getMember(d.guild, arr[1]) : type === 'server' ? await d.util.getGuild(d, arr[1]) : arr[1]) ?? arr[1];
        return user;
    }

    async function getData(user, data, key) {
        user = (type === 'globalUser' ? await d.util.getUser(d, data.key.split('_')[key]) : type === 'user' ? await d.util.getMember(d.guild, data.key.split('_')[key]) : type === 'server' ? await d.util.getGuild(d, data.key.split('_')[key]) : data.key.split('_')[key]) ?? data.key.split('_')[key];
        return user;
    }
}