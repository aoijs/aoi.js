module.exports = async d => {
    const data = d.util.openFunc(d);
    
    d.data.interaction?.deferUpdate();
    
    return {
        code: d.util.setCode({ function : d.func,code }) 
    }
}