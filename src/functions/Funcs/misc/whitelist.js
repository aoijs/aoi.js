module.exports = async (d) => {
  const { code } = d.command;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) d.error(err);

  let [type, ...ids] = inside.splits;

  if (!d.client.blacklist[type])
    return d.error(
      d.aoiError.functionErrorResolve(
        d,
        "custom",
        { inside },
        "Invalid Type Provided In",
      ),
    );
  if (type === "user") {
    const guildId = ids.shift();
    ids = ids.map((x) => `${x}_${guildId}`);
  }
  d.client.blacklist.whitelistIds(type, ...ids);

  return {
    code: code.replaceLast(`$whitelist${inside}`, ""),
  };
};
