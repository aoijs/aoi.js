module.exports = d => {
    const data = d.util.openFunc(d);
    
    d.data.interaction?.deferReply();
    
    return {
        code: d.util.setCode({ function : d.func,code : data.code }) 
    }
}