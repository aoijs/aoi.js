const {ChannelOptions} = require('../../Utils/Constants.js')
module.exports = async d => {
    const code = d.command.code 
    const options = Object.keys(ChannelOptions)
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
if(!options.includes(inside.inside)) return d.error(`\`${d.func}: Invalid Option Provided In ${inside}\` `)
options.split(";").shift() 
const OptExe = ChannelOptions[inside.inside].split(";")[1]
const ans = eval(`d.data?.newc?.${OptExe}`)||""
return {
code: code.replaceLast(`$newChannel${inside}`,ans)
}
}


