const ms = require('ms') 
module.exports = async d =>{
const {code} = d.command 
const inside = d.unpack()
const err = d.inside(inside) 
if(err) return d.error(err) 
let [time=1000,...reactions] = inside.splits;
reactions = reactions.reverse() 
time = await ms(time) 
if(!time) d.aoiError.fnError(d,"custom",{inside},"Invalid Time Provided In")

for(let i =reactions.length-1,i>=0;i--){
    d.message.react(reactions[i]).catch(err=>d.aoiError.fnError(d,"custom",{},err.message))
await d.util.constants.wait(time) 
}
return {
    code: d.util.setCode({function:d.func,code,inside, result:""}) 
}
}