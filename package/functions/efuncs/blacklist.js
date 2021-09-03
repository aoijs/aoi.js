module.exports = async d => {
    const {code} = d.command 
    const inside = d.unpack() 
    const err = d.inside(inside)
    if(err) d.error(err) 
    let [type,...ids] = inside.splits; 
    if(!d.client.blacklist[type]) return d.error(d.aoiError.functionErrorResolve(d,"custom",{inside},"Invalid Type Provided In"))
    const guild = ids.shift() 
    if(type === "user") ids = ids.map(x=>`${x}_${guild}`)
    d.client.blacklist.blacklistIds(type,...ids)  
    return {
      code:code.replaceLast(`$blacklist${inside}`,"") 
        }
}