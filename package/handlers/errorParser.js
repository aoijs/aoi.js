
const ErrorParser = (msg) =>{
 const checker = (thingy)  => msg.includes("{"+thingy+":");
    const embed = {}
//---------------------------------------//
   if(checker("title")){
  embed.title = msg.split("{title:")[1].split("}")[0] }
//---------------------------------------//
   if( checker("description")){
     embed.description = msg.split("{description:")[1].split("}")[0] }
//---------------------------------------//
   if(checker("footer")){ 
      const footer = msg.split("{footer:")[1].split("}")[0]
 const [footerText,footerURL=null] = footer.split(":") 
 embed.footer ={text:footerText,icon_url:footerURL} 
       }
//---------------------------------------//
    if(checker ("author")){
     const author =   msg.split("{author")[1].split("}")[0] 
    const [authorName,authorIcon=null,authorURL=""]= author.split(":") 
    embed.author = {
        name:authorName,
        icon_url:authorIcon,
        url:authorURL 
        }
        }
//---------------------------------------//
 if( checker("image")){
    embed.image = {
     url:msg.split("{image:")[1].split("}")[0]
     }
     }
//---------------------------------------//
 if( checker("url")){
     embed.url = msg.split("{url:")[1].split("}")[0] 
     }
//---------------------------------------//
if( checker("color")){
    embed.color = Number(parseInt(msg.split("{color:")[1].split("}")[0].replace("#",""),16).toString(10))
    }
//---------------------------------------//
 if(checker("thumbnail")){
     embed.thumbnail = {
     url:msg.split("{thumbnail:")[1].split("}")[0]
}
     }
//---------------------------------------//
if( checker ("timestamp")){
    const timestamp = msg.split("{timestamp:")[1].split("}")[0]
    if(timestamp===""){timestamp = Date.now()} 
    embed.timestamp = timestamp 
  }
//---------------------------------------//
 if( checker("field")){
     const fields = msg.split("{field:").slice(1)
 const res = [] 
 fields.forEach(x=>{
     const y = x.split("}")[0]
    const [name, value,incline=false] = y.split(":") 
    res.push({name:name,value:value,incline:incline}) 
     })
  embed.fields = res 
     }
    

//---------------------------------------//
 
    
 return embed 
    }
module.exports = ErrorParser ;