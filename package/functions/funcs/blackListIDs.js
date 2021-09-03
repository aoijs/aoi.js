const {ErrorHandler} = require("../../Handler/parsers.js");

module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack() 
  const err = d.inside(inside);
  if (err) return d.error(err);
let error = false 
  const [...options] = inside.splits;

 for(let option of options){
     if(error) break;
   option = option.split(":") 
     const type = option.shift() 
     const ErrorMsg = option.pop() 
    if(type === "user"){
        if(option.includes(d.author.id)){
            ErrorHandler(d,ErrorMsg)
            error = true 
        }
    }
    else if(type === "server"){
        if(option.includes(d.guild.id)) {
            ErrorHandler(d,ErrorMsg)
            error = true 
        }
    }
    else if(type === "role"){
        if(option.find(x=>d.member.roles.cache.find(x))){
            ErrorHandler(d,ErrorMsg)
            error = true 
        }
    }
    else if(type === "channel"){
        if(option.includes(d.channel.id)) {
            ErrorHandler(d,ErrorMsg)
            error = true 
        }
    }
 } 
    
  return {
    code: code.replaceLast(`$blackListIDs${inside}`, ""),
    error:error 
  };
};
