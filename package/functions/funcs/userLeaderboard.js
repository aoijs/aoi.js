module.exports = async d => {

            const code = d.command.code

            const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

            const [
        variable,
        type = "asc",
        custom = `{top}.- {username} - {value}`,
        list = 10,
        page = 1
    ] = inside.splits

            const all = await d.client.db.all("main", {
                filter: (x) => x.key.startsWith(`${variable}_${d.message.guild.id}_`)
            })

            let y = 0

            let content = []

            for (const data of all.sort((x, y) => Number(y.data.value) - Number(x.data.value))) {
                const member = d.message.guild.members.cache.get(data.key.split("_")[2])

                if (member) {
                    y++
                    
                    let text = custom.replace(`{top}`, y).replace("{id}", member.user.id).replace("{tag}", member.user.tag).replace(`{username}`, member.user.username.removeBrackets()).replace(`{value}`, Number(data.data.value))

                    if (custom.includes("{execute:")) {
                        const awaited = d.client.awaited_commands.find(c => c.name === custom.split("{execute:")[1].split("}")[0])
                        if (!awaited) return d.error(`❌ Invalid awaited command in \`$userLeaderboard${inside}\``)

                        const CODE = await d.interpreter(d.client, {
                            author: member.user,
                            member: member,
                            guild: d.message.guild,
                            channel: d.message.channel
                        }, d.args, awaited, undefined, true)

                        text = text.replace(`{execute:${custom.split("{execute:")[1].split("}")[0]}}`, CODE)
                    }

                    content.push(text)
                }
            }

            if (type === "desc") content = content.reverse()

            const px = page * list - list,
                py = page * list

            return {
                code: code.replaceLast(`$userLeaderboard${inside}`, content.slice(px, py).join("\n"))
            }
            //yeah
            //it so longg
}
