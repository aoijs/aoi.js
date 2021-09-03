module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const user =
    d.client.users.cache.get(inside.inside) ||
    (await d.client.users.fetch(inside.inside).catch(d.noop));

  return {
    code: code.replaceLast(`$userExists${inside}`, user ? true : false),
  };
};
