module.exports = async d =>{
 let code = d.command.code 
 let inside = d.unpack()
 let err = d.inside(inside)
 if(err) return d.error(err) 
  let object = inside.inside 
  let data = d.data.interaction 
 try {
let res = eval(`data.${object}`)
//console.log(data)
//console.log(res)
return {

        code: code.replaceLast(`$interactionData${inside}`, typeof res == "object" ? require('util').inspect(res,{depth:1}) : res || "")

        }
 }
catch (e){
 return {

        code: code.replaceLast(`$interactionData${inside}`, "")
     }
      }
    }
