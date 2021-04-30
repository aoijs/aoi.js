const guildRoles = async (d) => {
  let code = d.command.code;

  const r = code.split("$guildRoles").length - 1;

  const after = code.split("$guildRoles")[r].after();

  if (after.inside) {
    const [type = "name", amount = "25"] = after.splits;

    const realType =
      {
        id: "id",
        name: "name",
        mention: "mention",
      }[type] || "name";

    code = code.replaceLast(
      `$guildRoles${after}`,
      d.message.guild.roles.cache
        .filter((r) => r.name !== "@everyone")
        .map((r) =>
          realType === "mention" ? `${r}` : r[realType].deleteBrackets()
        )
        .slice(0, Number(amount))
        .join(", ")
    );
  } else {
    code = code.replaceLast(
      `$guildRoles`,
      d.message.guild.roles.cache
        .filter((r) => r.name !== "@everyone")
        .map((r) => r.name.deleteBrackets())
        .join(", ")
    );
  }

  return {
    code: code,
  };
};

module.exports = guildRoles;
