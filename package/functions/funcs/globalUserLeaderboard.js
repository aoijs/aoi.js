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
        filter: (x) => x.key.startsWith(`${variable}_`) && x.key.split("_").length === 2
    })

    let y = 0

    let content = []

    for (const data of all.sort((x, y) => Number(y.data.value) - Number(x.data.value))) {
        const user = await d.client.users.fetch(data.key.split("_")[1]).catch(err => {})

        if (user) {
            y++

            let text = custom.replace(`{top}`, y).replace("{id}", user.id).replace("{tag}", user.tag).replace(`{username}`, user.username.removeBrackets()).replace(`{value}`, Number(data.data.value))
            
            if (text.includes("{execute:")) {
                let ins = text.split("{execute:")[1].split("}")[0] 
                
                const awaited = d.client.awaited_commands.find(c =>c.name ===ins) 
                
                if (!awaited) return d.error(`\`${d.func}: Invalid awaited command '${ins}' in ${inside}\``)
                
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

    return {
        code: code.replaceLast(`$globalUserLeaderboard${inside}`, content.slice(px, py).join("\n"))
    }
    //yeah
//it so longg
}
