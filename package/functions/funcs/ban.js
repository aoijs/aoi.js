 
//hi
//im on pc u gotta see fast codem
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [userId, reason = undefined, days = 0] = inside.splits;
  const m = await d.util.getUser(userId)
  if (!m) return d.error(d.aoiError.functionErrorResolve(d,"user",{inside}));
  const member = await d.message.guild.members
    .ban(m, {
      reason: reason,
      days: days,
    })
    .catch((err) => null);
  if (!member) return d.error(`${d.func}: Failed To Ban The User: ${m.username}`);
  return {
    code: code.replaceLast(`$ban${inside}`, ""),
  };
};