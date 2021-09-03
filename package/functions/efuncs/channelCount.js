module.exports = async (d) => {
  const code = d.command.code;


  const inside = d.unpack();
  const [type="all",opt='includes'] = inside.splits;
let result;
    if(type==="all") result=d.guild.channels.cache.size 
    else result = d.guild.channels.cache.filter(x=>x.type === d.util.channelTypes[type]).size 
    return {
      code: d.util.setCode({function:d.func,code,inside, result})
    };

};
