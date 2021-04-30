module.exports = data => {
    const obj = {} 
    
    if (typeof data !== "string") return obj 
    
    data = data.split("\n").slice(data.split("\n").findIndex(d => d)).join("\n")
    
    if (!data) return obj 
    
    let lastData = data 
    let loop = true 
    let currLine = 0 
    let obtained = "" 
    let field 
    let maxcommandline = 1000
    let y = 0 
    
    function set() {
        obj[field.addBrackets().trim()] = obtained.addBrackets().trim()
        obtained = "" 
        currLine++ 
        field = "" 
        if (data.split("\n")[currLine] === undefined) loop = false 
    }
    
    while (loop) {
        if (y === 1000) return {} 
        
        const current = data.split("\n")[currLine] 
        
        if (current === undefined) {
            set() 
            
            return obj 
        }
        
        if (!field || current.match(/^(\S+):/)) {
            if (current.match(/^(\S+):/)) {
                field = current.split(":")[0] 
                obtained += current.split(":").slice(1).join(":")
                currLine++
                
                const next = data.split("\n")[currLine]
                
                if (next && next.match(/^(\S+):/)) {
                    currLine--
                    set() 
                } 
            } 
        } else 
        if (!current.match(/^(\S+):/)) {
            obtained += `\n${current}` 
            currLine++ 
            
            const next = data.split("\n")[currLine] 
            
            if (next && next.match(/^(\S+):/)) {
                currLine-- 
                set() 
            }
        } else {
            set()
        }
        
        y++
    }
    
    return obj 
}