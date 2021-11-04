module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err)

    const [variable, type = 'asc', custom = `{top}) {username} : {value}`, list = 10, page = 1] = data.inside.splits;

    const all = await d.client.db.all("main", (x) => x.key.startsWith(`${variable}_`) && x.key.split("_").length === 2)

    let y = 0

    let content = []

    for (const data of all.sort((x, y) => Number(y.data.value) - Number(x.data.value))) {
        const user = await d.client.guilds.fetch(data.key.split("_")[1]).catch(err => { })

        if (user) {
            y++

            let text = custom.replace(`{top}`, y).replace("{id}", user.id).replace(`{name}`, user.name.removeBrackets()).replace(`{value}`, Number(data.data.value))

            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0]

                const awaited = d.client.awaited_commands.find(c => c.name === ins)

                if (!awaited) return d.error(`❌ Invalid awaited command '${ins}' in \`$serverLeaderboard${inside}\``)

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

    data.result = content.slice(px, py).join("\n");

    return {
        code: d.util.setCode(data)
    }
}