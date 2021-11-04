module.exports = async d => {
    const {code} = d.command 
    const inside = d.unpack() 
    const err = d.inside(inside)
    if(err) return d.error(err) 
    let [channelId,userFilter,time,replies,cmds,errorMsg="",data="",dm] = inside.splits; 
    try {
        data = JSON.parse(data)
    } 
    catch(e){
        d.aoiError.fnError(d,"custom",{inside},"Invalid Data Provided In") 
} 
    errorMsg = await d.util.errorParser(errorMsg,d.client) 
    userFilter = userFilter === "everyone" ? userFilter : userFilter.split(",") 
    time = ms(time) 
    if(!time) d.aoiError.fnError(d,"custom",{inside},"Invalid Time Provided In") ;
    cmds = cmds.split(",") 
    cmds.forEach(x => {
        if(!d.client.cmd.awaited.find(x => x.name.toLowerCase() === x.toLowerCase())) return d.aoiError.fnError(d,"custom",{},"Couldn't Find Awaited Command: "+x) 
        }) 
    replies = replies.split(",") 
    let channel; 
    if(dm){
        channel = (await d.util.getUser(dm)).dmChannel 
    } 
    else {
        channel = await d.util.getChannel(channelId) 
    } 
    const filter = (m) => (userFilter === "everyone" ? true : userFilter.some(id=>id === m.author.id)) && replies.includes(m.content.toLowerCase()) 
    channel.awaitMessages({filter,time,max:1,errors:["time"]})
        .then(async collected => {
        collected = collected.first() 
        const c = cmds[replies.indexOf(collected.content.toLowerCase())]
        const cmd = d.client.cmd.awaited.find(x => x.name.toLowerCase() === c)
        await d.interpreter(
            d.client,
            collected,
            collected.content.split(" "),
            cmd,
            d.client.db,
            false, undefined,
            {awaitData:data}
        ) 
    })
        .catch(err=>{
        if(errorMsg !== "") d.aoiError.makeMessageError(d.client,channel,errorMsg,errorMsg.options) 
    })
    return {
        code:d.util.setCode({function:d.func,code,inside})
    }
    }
