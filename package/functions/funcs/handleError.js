module.exports = async d =>{ 
let inside = d.unpack()
let err = d.inside(inside) 
let code = d.command.code

if(err){
d.error(err) 
}

else {

let type = inside.inside 
if(!["command","error","function"].includes(type)) return d.channel.send(`\`${d.func}: Invalid Type Provided In ${inside}\``)

let res;
    if(type== "command"){res = d.data.err.command}
    else if(type == "function"){res = d.data.err.function} 
    else if(type == "error") {res = d.data.err.content}
 return {
     code: code.replaceLast(`$handleError${inside}`,res? require('util').inspect(res).replace(/'/g,""). deleteBrackets (): "")
     }
}
}