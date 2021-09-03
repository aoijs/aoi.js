const songOptions  =require("../../utils/songOptions")

module.exports = async d => {

    const code = d.command.code

    const inside = d.unpack()

	const err = d.inside(inside)

	if (err) return d.error(err)

const [opt,Pos = 0] = inside.splits

    

    const option = Object.keys(songOptions).find(key => key === opt)

    if (!option) return d.error(`:x: Invalid option '${inside}' in \`$songInfo${inside}\``)

    const server = d.client.servers.get(d.message.guild.id)

    if (!server) return d.error(`:x: Nothing is being played`)

    if (!server.songs.length) return d.error(`:x: Nothing is being played!`)

if(Pos >= server.songs.length) return d.error(`:x: No Track present at that position`)

    return {

       

        code: code.replaceLast(`$songInfo${inside}`, String(server.songs[Pos][option](server)).deleteBrackets())

    }

} 

