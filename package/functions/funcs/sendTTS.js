module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()

	const err = d.inside(inside)
	if (err) return d.error(err)

    let [
         msg,channel= d.message.channel.id
    ] = inside.splits
    
if(!msg){

d.error(`\`${d.func}: Please provide a text string in ${inside.splits.join(";")}\``)
}
else{
    
try {
    const chan = await d.message.guild.channels.cache.get(channel)

    chan.send(msg,{tts:true})
}

catch(e){}
}
    return {
        code: code.replaceLast(`$sendTTS${inside}`, "")
    }
}