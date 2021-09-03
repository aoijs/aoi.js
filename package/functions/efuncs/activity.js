module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack()
  if (inside.inside) {
    let u = d.client?.users?.cache.get(inside.inside);
      if(!u){
       u = await d.client.users.fetch(inside.inside).catch(e=>{});   
      }
    if (!u) return d.error(`\`${d.func}: Invalid user ID in ${after.total}\``);
    return {
      code: code.replaceLast(
        `$activity${inside}`,
        u.presence?.activities?.join(", ").deleteBrackets() || "none"
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$activity`,
        d.message.author?.presence?.activities?.join(", ").deleteBrackets() ||
          "none"
      ),
    };
  }
};
