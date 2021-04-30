module.exports = async d => {

    const code = d.command.code

    const inside = d.unpack()

	const err = d.inside(inside)

	if (err) return d.error(err)

    let [

      

         msg

    ] = inside.splits

    

    msg = msg

    

    const channel = await d.message.channel

    
    channel.send(msg,{tts:true})

    

    return {

        code: code.replaceLast(`$sendTTS${inside}`, "")

    }

}// it worked i dont know lmao how even this trash code works 
