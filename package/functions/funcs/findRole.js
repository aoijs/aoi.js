module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findRole").length - 1;

  const inside = code.split("$findRole")[r].after();

  const manager = d.message.guild.roles.cache;

  //console.log(inside.toLowerCase().addBrackets())
  const role =
    manager.get(inside.addBrackets()) ||
    manager.find(
      (r) => r.name.toLowerCase() === inside.addBrackets().toLowerCase()
    ) ||
    d.message.mentions.roles.first();

  return {
    code: code.replaceLast(`$findRole${inside}`, role ? role.id : ""),
  };
};
