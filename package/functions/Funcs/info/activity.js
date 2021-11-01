module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack()
  const [id = d.author?.id] = inside.splits; 
    let u = await d.util.getUser(d,id)
    if (!u) return d.aoiError.fnError(d,"user",{inside}) 
    return {
      code: d.util.setCode({function:d.func,code,inside,result:u.presence?.activities?.join(", ")?.deleteBrackets() || "none"})
}
    };