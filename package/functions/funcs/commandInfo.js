module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$commandInfo").length - 1;

  const inside = code.split("$commandInfo")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [name, option] = inside.splits;

  const command =
    d.client.bot_commands.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        (c.aliases && typeof c.aliases === "object"
          ? c.aliases.includes(name.toLowerCase())
          : c.aliases === name.toLowerCase())
    ) || {};

  const property = command[option] === undefined ? "" : command[option];

  return {
    code: code.replaceLast(
      `$commandInfo${inside}`,
      (
        (typeof property === "object"
          ? typeof property.join === "function"
            ? property.join(",")
            : require("util").inspect(property)
          : property) || ""
      ).deleteBrackets()
    ),
  };
};
