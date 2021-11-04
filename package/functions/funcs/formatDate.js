const { FormatDate } = require('../../../Utils/helpers/functions.js');

module.exports = async d => {
    const data = d.util.openFunc(d);
    
    const [ date = Date.now() , format = "dddd,DD MMMM YYYY" ] = data.inside.splits;
    
    const RawDate = new Date(Number(date));
    
    if(!RawDate.getTime()) return d.aoiError.fnError(d,"custom",{ inside : data.inside },"Invalid Date Provided In");
    
    data.result = FormatDate(date,format);
    
    return {
        code : d.util.setCode( data ) 
    } 
} 
