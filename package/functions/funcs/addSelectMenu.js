const {MessageSelectMenu} = require('discord.js') 
module.exports = async d =>{
    const {code} = d.command 
    const inside = d.unpack() 
    const err = d.inside(inside) 
    if(err) return d.error(err) 
    let [index=1,customId,placeHolder,minValues=1,maxValues=1,disabled=false,...options] = inside.splits
    const components = new MessageSelectMenu()
    index = Number(index) -1 
    disabled = disabled ? disabled.replace("yes",true).replace("true",true).replace("no", false).replace("false",false) : disabled 
    placeHolder = placeHolder?.addBrackets()
    customId = customId?.addBrackets() 
    minValues = Number(minValues)
    maxValues = Number(maxValues)
    if(!options.length) d.error(`${d.func}:Options Are Not Provided In ${inside}`)
    if(minValues > 25 || minValues <0) return d.error(`${d.func}:minValues must be between 0 and 25 (both inclusive)`)
    if(maxValues > 25 || maxValues < 1) return d.error(`${d.func}:maxValues must be between 1 and 25 (both Inclusive)`)
    if(placeHolder.length > 100) return d.error(`${d.func}: Placeholder should be at most 100 char long`)
    d.components[index] = d.components[index]||{type:1, components:[]}
    components.setCustomId(customId)
        .setPlaceholder(placeHolder)
        .setMaxValues(maxValues)
        .setMinValues(minValues)
        .setDisabled(disabled)
       for(let option of options){
           option = option.split(":")
           const label = option.shift().addBrackets()
           const description = option.shift().addBrackets() 
           const value = option.shift().addBrackets()
           const def = option.shift()?.addBrackets().replace("yes",true).replace("no",false).replace("true",true).replace("false",false) || false 
           const emoji = option.join(":")?.addBrackets() 
          components.addOptions({label, description,value,default:def,emoji})
       }
    d.components[index].components.push(components)
    return {
        code: code.replaceLast(`$addSelectMenu${inside}`,""),
        components:d.components 
    }
}
