const {EmbedParser, ComponentParser,FileParser} = require('../../Handler/parsers.js') 
module.exports = async d => {

    const {code} = d.command 

    const inside = d.unpack() 

    const err = d.inside(inside)

    if(err) d.error(err) 

    let [type,ErrorMsg] = inside.splits;
    try {
    ErrorMsg = JSON.parse(ErrorMsg) 
        if(typeof ErrorMsg === "object"){
    ErrorMsg.embeds = await EmbedParser(ErrorMsg.embeds||"")
    ErrorMsg.components = await ComponentParser(ErrorMsg.components||"")
    ErrorMsg.files = await FileParser(ErrorMsg.files||"")
            }
        }
    catch(r){
        ErrorMsg = JSON.stringify(ErrorMsg) 
    }
    if(!d.client.blacklist[type]) return d.error(d.aoiError.functionErrorResolve(d,"custom",{inside},"Invalid Type Provided In"))

    d.client.blacklist[type].errorMsg = ErrorMsg 

    return {

      code:code.replaceLast(`$blacklistError${inside}`,"") 

        }

}