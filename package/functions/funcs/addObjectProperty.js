module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [key, value,returnValue= "no"] = inside.splits;
  if (!d.object)
    return d.error(
      `$addObjectProperty:Object Doesn't Exist`
    );
  let result = "";
  try {
    result = JSON.parse(value.addBrackets());
  } catch {
    result = value;
  }
  d.object[key] = result;
  return {
    object: d.object,
    code: code.replaceLast(`$addObjectProperty${inside.total}`, returnValue==="yes"?result:'')
  };
};
