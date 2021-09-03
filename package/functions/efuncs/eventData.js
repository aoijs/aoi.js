module.exports = async d =>{
const code = d.command.code
const inside = d.unpack()
const err = d.inside(inside)
if(err) return d.error(err)
    let evaled;
    try {
        evaled = eval(`d.data.eventData${inside.inside}`)
    }
    catch(e){
        evaled = ""
    }
return {
   code:code.replaceLast(`$eventData${inside}`,evaled||"")
}
}