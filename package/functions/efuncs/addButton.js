const {MessageButton} = require('discord.js') 
const {ButtonStyleOptions} = require('../../Utils/Constants.js')
module.exports = async d =>{
    const {code} = d.command 
    const inside = d.unpack() 
    const err = d.inside(inside) 
    if(err) return d.error(err) 
    let [index=1,label,style,cus,disabled=false,emoji] = inside.splits
    index = Number(index)-1
    label = label.addBrackets()
const components = new MessageButton()
    cus=cus.addBrackets()
    disabled = disabled ? disabled.replace("yes",true).replace("true",true).replace("no",false).replace("false",false): disabled
    style = ButtonStyleOptions[style]||Number(style)
  //  if(!style || style <1 || style > 5 ||isNaN(style)||!["PRIMARY","SECONDARY","DANGER","SUCCESS","LINK"].includes(style)) return d.error(`${d.func}:Inavlid Style Provided In ${inside}`)
    if(!cus) return d.error(`${d.func}:${style === 5 ? "URL" : "CustomId"} Not Provided In ${inside}`)
    d.components[index] = d.components[index]||{type:1, components:[]}
    components.setLabel(label)
        .setStyle(style) 
   if(style === 5 || style === "LINK") components.setUrl(cus)
    else components.setCustomId(cus)
    components.setDisabled(disabled)
    if(emoji) components.setEmoji(emoji)
    d.components[index].components.push(components)
    return {
        code: code.replaceLast(`$addButton${inside}`,""),
        components:d.components 
    }
}