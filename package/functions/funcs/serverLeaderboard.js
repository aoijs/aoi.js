module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

	const err = d.inside(inside)
	if (err) return d.error(err)

    const [

        variable,

        type = "asc",

        custom = `{top}.- {servername} - {value}`,

        list = 10,

        page = 1

    ] = inside.splits

    const all = await d.client.db.all("main", {

        filter: (x) => x.key.startsWith(`${variable}_`) && x.key.split("_").length === 2

    })

    let y = 0

    let content = []

    for (const data of all.sort((x, y) => Number(y.data.value) - Number(x.data.value))) {

        const guild = d.client.guilds.cache.get(data.key.split("_")[1]) ? d.client.guilds.cache.get(data.key.split("_")[1]) : undefined

        if (guild) {

            y++

            let text = custom.replace(`{top}`, y).replace("{id}", guild.id).replace(`{servername}`, guild.name.removeBrackets()).replace(`{value}`, Number(data.data.value))

            if (text.includes("{execute:")) {

                let ins = text.split("{execute:")[1].split("}")[0]

                const awaited = d.client.awaited_commands.find(c =>c.name ===ins)

                if (!awaited) return d.error(`\`${d.func}: Invalid awaited command '${ins}' in ${inside}\``)

                const CODE = await d.interpreter(d.client, {

                    guild: guild, 

                    channel: d.message.channel, 

                    author: d.author

                }, d.args, awaited, undefined, true)

                text = text.replace(`{execute:${ins}}`, CODE)
            }
            content.push(text)
        }
    }

    if (type === "desc") content = content.reverse()

    const px = page * list - list, py = page * list

    return {
        code: code.replaceLast(`$serverLeaderboard${inside}`, content.slice(px, py).join("\n"))
    }
}
