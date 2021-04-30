const memberOptions = require("../../utils/memberOptions") 

module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)
 
 const option = Object.keys(memberOptions).find(opt => opt === inside.inside) 
 
 if (!option) return d.error(`❌ Invalid option in \`$newMember${inside}\``) 
 
 const executor = memberOptions[option].split(";").slice(1).join(";")
 
 return {
 code: code.replaceLast(`$newMember${inside}`, d.data.new_member ? eval(`d.data.new_member${executor}`) || "" : "")
 }
}