const {ChannelOptions} = require("../../Utils/Constants.js") 

module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    if(!Object.keys(ChannelOptions).includes(inside.inside)) return d.error(`\`${d.func}: Invalid Option Provided In ${inside}\` `)
 const OptExe = ChannelOptions[inside.inside].split(";")[1]
const ans = eval(`d.data?.oldc?.${OptExe}`)||""
    return {
        code: code.replaceLast(`$oldChannel${inside}`,ans)
    }
}