module.exports = async d =>{
let code = d.command.code 
let inside = d.unpack()
let err = d.inside(inside) 
if(err) return d.error(err) 
let [query,type = "equal", separator = ","] = inside.splits 

if(!["equal","starts","ends","includes"].includes(type)) return d.error(`\`${d.func}: Invalid Type Provided in ${inside}\``)

let res;
    switch (type){
      case "equal" :
            res = d.array.filter(x=>x === query)
            break;
            case "starts":
            res = d.array.filter(x=>x.startsWith(query))
            break;
            case "ends" :
            res = d.array.filter(x=>x.endsWith(query)) 
            break;
            case "includes":
            res = d.array.filter(x=>x.includes(query))
            break;
            
            }
   return {
       code: code.replaceLast(`$filterTextSplitElement${inside}`,res.join(separator))
       }
}
