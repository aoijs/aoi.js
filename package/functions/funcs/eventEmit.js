module.exports = async d =>{
const code = d.command.code
const inside = d.unpack()
const err = d.inside(inside)
if(err) return d.error(err)
    let [name,...datas] = inside.splits
   if(!d.client.customEvents) return d.error("$eventEmit: CustomEvent class is not initialised")
    const emitData =[]
    for(const data of datas){
        try{
            emitData.push(JSON.parse(data))
        }
        catch(e){
            emitData.push(data)
        }
    }
return {
   code:code.replaceLast(`$eventEmit${inside}`,d.client.customEvents.emit(name,...emitData))
}
}