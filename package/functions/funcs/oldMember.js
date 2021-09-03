const memberOptions = require("../../utils/memberOptions") 

module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err) 
 
 const option = Object.keys(memberOptions).find(opt => opt === inside.inside) 
 
 if (!option) return d.error(`❌ Invalid option in \`$oldMember${inside}\``) 
 
 const executor = memberOptions[option].split(";").slice(1).join(";")
 
 return {
 code: code.replaceLast(`$oldMember${inside}`, d.data.old_member ? eval(`d.data.old_member${executor}`) || "" : "")
 }
}