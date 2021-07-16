module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split("$getCollectionKey").length - 1 
    
    const inside = code.split("$getCollectionKey")[r].after()

    const err = d.inside(inside);

    if (err) return d.error(err);
    
    const [cname, key] = inside.splits 
    
    const collection = d.client.collections[cname.addBrackets()]
    
    if (!collection) return d.error(`\`${d.func}: Invalid collection name in ${inside}\``)
    
    const data = collection.get(key.addBrackets())
    
    return {
        code: code.replaceLast(`$getCollectionKey${inside}`, data ? data.deleteBrackets() : "") 
    }
}