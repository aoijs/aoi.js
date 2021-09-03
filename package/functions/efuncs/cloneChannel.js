module.exports = async (d) => {
  const code = d.command.code;
 const inside = d.unpack() 
 let [id=d.channel.id,returnId="no"] = inside.splits; 
  const channel = d.guild.channels.cache.get(id) 
  if(!channel) return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}))
    const c = await channel.clone(channel.name) 
    return {
      code: d.util.setCode({function:d.func,inside,code, result: returnId === "yes" ? c?.id : ""})

    };

};
