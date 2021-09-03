module.exports = async d => {
    const code = d.command.code 
    
    const after = d.unpack()
    
    if (after.inside) {
        const id = after.inside
        
        const user = await d.client.users.fetch(id).catch(err => null) 
        
        if (!user) return d.error(`❌ Invalid user ID in \`$isUserDMEnabled${after}\``) 
        
        const c = await user.send("").catch(err => err.code)
        
        return {
            code: code.replaceLast(`$isUserDMEnabled${after}`, c === 50007 ? false : true)
        }
    } else {
        const c = await d.message.author.send("").catch(err => err.code) 
        
        return {
            code: code.replaceLast(`$isUserDMEnabled`, c === 50007? false : true)
        }
    }
}