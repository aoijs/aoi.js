module.exports = async d => {
    const Data = d.util.openFunc(d);
    if (Data.err) return d.error(Data.err)

    const [variable, type = 'asc', custom = `{top}) {username} : {value}`, list = 10, page = 1,table = d.client.db.tables[0]] = Data.inside.splits;

    const all = await d.client.db.all(table, (x) => x.key.startsWith(`${variable}_`) && x.key.split("_").length === 2)

    let y = 0

    let content = []

    for (const data of all.sort((x, y) => Number(y.data.value) - Number(x.data.value))) {
        const user = await d.client.users.fetch(data.key.split("_")[1]).catch(err => { })

        if (user) {
            y++

            let text = custom.replace(`{top}`, y).replace("{id}", user.id).replace("{tag}", user.tag).replace(`{username}`, user.username.removeBrackets()).replace(`{value}`, Number(data.data.value))

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0]

                const awaited = d.client.cmd.awaited.find(c => c.name === ins)

                if (!awaited) return d.aoiError.fnError(d,'custom',{inside : Data.inside},` Invalid awaited command '${ins}' in`)

                const CODE = await d.interpreter(d.client, {
                    guild: d.message.guild,
                    channel: d.message.channel,
                    author: user
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