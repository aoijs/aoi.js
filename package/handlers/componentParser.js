const ComponentParser = (c) =>{
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
        let [label,type,style,cus,emoji=undefined,disabled=false] = z.split(",") 
//     console.log(z)
       
    //   console.log(emoji)
       if(style == 5){
      data ={label:label,type:Number(type),style:Number(style),url:cus.replace("#COLON#",":"),disabled:disabled}
           if(emoji){
               const [ename,eid,eani] = emoji.split("|")
               data.emoji = {name:ename,id:eid, animated:eani}
           }
           }
           else {
               data = {label:label,type:Number(type),style:Number(style),custom_id:cus, disabled:disabled}
               if(emoji){
               const [ename,eid,eani] = emoji.split("|")
               data.emoji = {name:ename,id:eid, animated:eani}
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
