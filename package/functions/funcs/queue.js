module.exports = async d => {
    const code = d.command.code
    
    const r = code.split("$queue").length - 1
    
    const after = code.split("$queue")[r].after()
    
    if (!after.inside) {
        const server = d.client.servers.get(d.message.guild.id) 
        
        if (!server) return d.error(`:x: Nothing is being played!`) 
        
        return {
            code: code.replaceLast(`$queue`, server.songs.slice(0, 10).map((song, index) => {
                return `${index +1}) ${song.title().removeBrackets()
                } by <@${song.userID()}>`
            }).join("\n"))
        }
    }
    
    let [
        page = 1, 
        amount = 10,
        custom = `{number}) {title} by <@{userID}>`,
		current = "no"
    ] = after.splits
    
    amount = Number(amount) 
    page = Number(page)
    
    const server = d.client.servers.get(d.message.guild.id)

    if (!server) return d.error(`:x: Nothing is being played!`)

  /*let k = 10;

  for (let i = 0; i < server.songs.length; i += 10) {
    const current = server.songs.slice(i, k);
    let j = i;
    k += 10; */

    const songs = []
    let y = amount * page - amount

	if (current.toLowerCase() !== "yes" && y <= 0)
		y = 1

//ignore below
    for (const song of server.songs.slice(y, amount * page)) {
		let user

		if (['{username}', '{discriminator}', '{usertag}'].some(s => custom.includes(s)))
			user = await d.client.users.fetch(song.userID())

        songs.push(custom.replace(/{number}/g, y).replace(/{userID}/g, user ? user.id : song.userID()).replace(/{title}/g, song.title().removeBrackets()).replace(/{url}/g, song.url()).replace(/{description}/g, song.description()).replace(/{duration}/g, song.duration()).replace(/{publisher}/g, song.publisher()).replace(/{publisher_url}/g, song.publisher_url()).replace(/{username}/g, user ? user.username : '').replace(/{discriminator}/g, user ? user.discriminator : '').replace(/{usertag}/g, user ? user.tag : ''))

        y++
    }

    return {
        code: code.replaceLast(`$queue${after.total}`, songs.join("\n").deleteBrackets())
    }
}