module.exports = async d => {
const { code,inside } = d.util.openFunc(d);
    
    const [ args ] = inside.splits;
    
    if(isNaN(args) && args ) return d.aoiError.fnError(d,"custom",{ inside },"Invalid Index Provided In");
    
    const result = args ? d.args[args]?.deleteBrackets() : d.args.join(" ")?.deleteBrackets();
    
    return {
        code : d.util.setCode({ function : d.func,code,inside,result }) 
    } 
}