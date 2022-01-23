const {AoijsAPI, DbdTsDb, AoiMongoDb, Promisify, CustomDb} = require("../../../classes/Database.js");

module.exports = async d => {
    const Data = d.util.openFunc(d);
    if (Data.err) return d.error(Data.err)

    const [variable, type = 'asc', custom = `{top}) {username} : {value}`, list = 10, page = 1, table = d.client.db.tables[0]] = Data.inside.splits;

    const all = await d.client.db.all(table, variable.addBrackets(), 1)

    let y = 0
    let value;
    let content = []

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

            user = await d.util.getGuild(d, data.key.split('_')[1])
        } else if (d.client.db instanceof DbdTsDb) {
            value = Number(data[variable.addBrackets()]);

            user = await d.util.getGuild(d, data.key.split('_')[0])
        } else if (d.client.db instanceof AoiMongoDb) {
            value = Number(data.value)

            user = await d.util.getGuild(d, data.key.split('_')[1])
        } else if (d.client.db instanceof CustomDb || d.client.db instanceof Promisify) {
            value = Number(data.value || data[variable.addBrackets()] || (typeof data.data === 'object' ? data.data.value : data.data))

            if (data.key) {
                const arr = data.key.split('_');
                user = await d.util.getGuild(d, arr.length === 2 ? arr[1] : arr[0])
            } else if (data.id) {
                const arr = data.id.split('_');
                user = await d.util.getGuild(d, arr.length === 2 ? arr[1] : arr[0])
            } else if (data.ID) {
                const arr = data.ID.split('_');
                user = await d.util.getGuild(d, arr.length === 2 ? arr[1] : arr[0])
            } else if (data.Id) {
                const arr = data.Id.split('_');
                user = await d.util.getGuild(d, arr.length === 2 ? arr[1] : arr[0])
            } else {
                d.aoiError.fnError(d, 'custom', {}, 'Database Not Supported For LeaderBoard')
                break;
            }
        }


        if (user) {
            y++

            let text = custom.replace(`{top}`, y).replace("{id}", user.id).replace(`{name}`, user.name.removeBrackets()).replace(`{value}`, value)

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0]

                const awaited = d.client.cmd.awaited.find(c => c.name === ins)

                if (!awaited) return d.aoiError.fnError(d, 'custom', {inside: Data.inside}, ` Invalid awaited command '${ins}' in`)

                const CODE = await d.interpreter(d.client, {
                    guild: user,
                    channel: d.message.channel,
                }, d.args, awaited, undefined, true)

                text = text.replace(`{execute:${ins}}`, CODE)
            }

            content.push(text)
        }
    }

    if (type === "desc") content = content.reverse()

    const px = page * list - list, py = page * list

    Data.result = content.slice(px, py).join("\n");

    return {
        code: d.util.setCode(Data)
    }
}