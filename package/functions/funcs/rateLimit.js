const rateLimitOptions = require("../../utils/rateLimitOptions")
module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)
 
 const option = Object.keys(rateLimitOptions).find(opt => opt === inside.inside) 
 
 if (!option) return d.error(`\`${d.func}: Invalid option in ${inside}\``)
 
 const executor = rateLimitOptions[option].split(";").slice(1).join(";")
 
 return {
 code: code.replaceLast(`$rateLimit${inside}`, d.data.ratelimit ? eval(`d.data.ratelimit${executor}`) : "")
 }
}