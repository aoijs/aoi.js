module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();
  let [type] = inside.splits;
  const result = type
    ? d.client.emojis.cache.filter((x) =>
        type === "animated"
          ? x.animated
          : type === "roles"
          ? x.roles.size
          : type === "normal"
          ? !x.animated
          : x[type],
      ).size
    : d.client.emojis.cache.size;
  return {
    code: d.util.setCode({ function: d.func, code, inside, result }),
  };
};
