module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$createObject").length - 1;

  const inside = code.split("$createObject")[r].after();

  try {
    var json = JSON.parse(inside.addBrackets());
  } catch (error) {
    return d.error(`:x: Invalid object given in \`$createObject${inside}\``);
  }

  return {
    object: json,
    code: code.replaceLast(`$createObject${inside}`, ""),
  };
};
