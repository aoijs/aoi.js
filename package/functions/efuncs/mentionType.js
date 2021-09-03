module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack() 
 
 const mention = inside.addBrackets() 
 
 return {
 code: code.replaceLast(`$mentionType${inside}`, /^<@!?(\d{17,19})>$/.test(mention) ? "user" : /^<#(\d{17,19})>$/.test(mention) ? "channel" : /^<@&(\d{17,19})>$/.test(mention) ? "role" : "none") 
 }
}