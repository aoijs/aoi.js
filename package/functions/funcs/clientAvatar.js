const clientAvatar = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();
  if (!inside.splits[0]) {
    inside.splits.shift();
    inside.splits.unshift(d.client.user.id);
  }

  const [size = "2048", dynamic = "yes"] = inside.splits || [];

  
  code = code.replaceLast(
    `$clientAvatar${inside}`,
    client.user.displayAvatarURL({
      dynamic: dynamic === "yes" ? true : false,
      size: Number(size),
    })
  );
// Aoi.js
  return {
    code: code,
  };
};

module.exports = clientAvatar;
