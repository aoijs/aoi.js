const ms = require("ms") 

module.exports = async d => {
    const code =d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [cname, key, value, temporal] = inside.splits
    
    if (!d.client.collections[cname.addBrackets()]) return d.error(`❌ Invalid collection name in \`$setCollectionKey${inside}\``) 
    
    d.client.collections[cname.addBrackets()].set(key.addBrackets(), value.addBrackets()) 
    
    if (temporal) {
        const time = ms(temporal) 
        
        if (!time) return d.error(`❌ Invalid temp duration in \`$setCollectionKey${inside}\``) 
        
        setTimeout(() => d. client.collections[cname.addBrackets()].delete(key.addBrackets()), time)
        
    }
    
    return {
        code: code.replaceLast(`$setCollectionKey${inside}`, "")
    }
}