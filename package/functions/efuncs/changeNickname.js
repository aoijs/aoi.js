module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [userId = d.message.author.id, nickname="",reason] = inside.splits;


  const member = await d.util.getMember(userId)

  if (!member)
    return d.error(
    d.aoiError.functionErrorResolve(d,"user",{inside})
    );

  const m = await member.setNickname(nickname.addBrackets(),reason?.addBrackets()).catch((err) => undefined);

  if (!m)
    return d.error(
     d.aoiError.functionErrorResolve(d,"custom",{},"Failed To Change Nickname Of "+member.user.username )
    );

  return {
    code: code.replaceLast(`$changeNickname${inside}`, ""),
  };
};
