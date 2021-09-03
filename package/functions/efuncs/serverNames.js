module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const sep = d.inside(inside) ? "," : inside.inside;

  return {
    code: code.replaceLast(
      `$serverNames${inside}`,
      d.client.guilds.cache.map((g) => g.name.deleteBrackets()).join(sep)
    ),
  };
};
