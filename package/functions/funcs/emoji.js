const { Emoji } = require('../../../Utils/helpers/functions.js');
module.exports = async d => {
    const { code,inside,err } = d.util.openFunc(d);
    if(err) return d.error(err);
    
    let [ emoji,option ] = inside.splits;
    
    emoji = await d.util.getEmoji(d,emoji.addBrackets());
    if(!emoji) return d.aoiError.fnError(d,"emoji",{ inside });
    let result =  Emoji(emoji)[option]; 
    
    console.log({ result,emoji:Emoji(emoji).name,option,inside:inside.splits})
    return {
        code : d.util.setCode({ function : d.func,code,inside,result })
    } 
} 