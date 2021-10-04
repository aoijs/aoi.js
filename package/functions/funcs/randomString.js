const chars = require("../../utils/characters.js")

module.exports= async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const length = Number(inside.inside)

    if (!length) return d.error(`:x: Invalid number in \`$randomString${inside}\``)
    
    let result = []
    
    if (d.randoms[`strings-${inside}`]) result = [d.randoms[`strings-${inside}`]]
    
    if (!result.length) for (let i = 0;i < length;i++) {
        result.push(chars[Math.floor(Math.random() * chars.length)])
    }
    
    if (!d.randoms[`strings-${inside}`]) d.randoms[`strings-${inside}`] = result.join("")
    
    return {
        code: code.replaceLast(`$randomString${inside}`, result.join("")), 
        randoms: d.randoms 
    }
}