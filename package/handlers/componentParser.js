const {mustEscape} = require('../utils/mustEscape.js')
const ComponentParser = async (c) =>{
c = await mustEscape(c)
    const checker = (thingy) => c.includes("{"+thingy+":") 
    
    if(checker("actionRow")){ 
        const actionRows = c.split("{actionRow:").slice(1)
    
    let res = [] 
    let data;
    actionRows.forEach(x=>{
       
        let y = x.split("}")[0] 
        //console.log("y:"+y)
        const inside = y.split(":")
        //console.log("inside:"+inside)
        let buttons = [] 
        inside.forEach(z=>{
        let [label,type,style,cus,emoji=undefined,disabled="no"] = z.split(",") 
//     console.log(z)
       
    //   console.log(emoji)
       if(style == 5){
      data ={label:label.addBrackets(),type:Number(type),style:Number(style),url:cus.addBrackets(),disabled:disabled.replace("yes",true).replace("no",false)}
           if(emoji){
               const [ename,eid=0,eani=false] = emoji.split("|")
               data.emoji = {name:ename.addBrackets(),id:eid.addBrackets(), animated:eani.addBrackets()}
           }
           }
           else {
               data = {label:label.addBrackets(),type:Number(type),style:Number(style),custom_id:cus.addBrackets(), disabled:disabled.replace("yes",true).replace("no",false)}
               if(emoji){
               const [ename,eid=0,eani=false] = emoji.split("|")
               data.emoji = {name:ename.addBrackets(),id:eid.addBrackets(), animated:eani.addBrackets()}
               }
               }
       buttons.push(data)
    }) 
        res.push({type:1, components:buttons})
    })
        
    return res 
       //console.log(res)
        }
}
module.exports = ComponentParser;
