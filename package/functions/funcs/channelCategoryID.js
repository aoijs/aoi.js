module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const [id=d.channel?.id]=inside.splits;
  const channel = await d.util.getChannel(d,id) 
  if(!channel) return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside})) 
    return {
        code:d.util.setCode({function:d.func,inside,code, result: channel.parentId}) 
    }
}
