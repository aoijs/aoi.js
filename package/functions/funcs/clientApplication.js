module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$clientApplication").length - 1;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let option = inside.inside;

  let clientapp = await d.client.fetchApplication()

  if (!option) return d.error(`\`${d.func}: Missing property in ${inside}\``);
  if(
    ![
    "id",
    "name",
    "owner",
    "ispublic",
    "createdat",
    "requiredcg",
    "coverimage",
    "icon",
    "createdtimestamp",
    "description",
    "rpcorigins",
    "token",
    ].includes(option)
  )
  return d.error(`\`Invalid property given inside ${inside}\``);

  switch (option) {
    case "ispublic":
        option = clientapp.botPublic;
        break;
    case "requiredcg":
        option = clientapp.botRequireCodeGrant;
        break;
    case "coverimage":
        option = clientapp.cover;
        break;
    case "icon":
        option = clientapp.iconURL();
        break;
    case "createdat":
        option = clientapp.createdAt;
        break;
    case "createdtimestamp":
        option = clientapp.createdTimestamp;
        break;
    case "description":
        option = clientapp.description;
        break;
    case "id":
        option = clientapp.id;
        break;
    case "name":
        option = clientapp.name;
        break;
    case "owner":
        option = clientapp.owner;
        break;
    case "rpcorigins":
        option = clientapp.rpcOrigins.length != 0 ? clientapp.rpcOrigins :  null;
        break;
    case "token":
        option = d.client.token;
        break;
    default:
      undefined;
  }

  return {
    code: d.command.code.replaceLast(`$clientApplication${inside}`, option),
  };
};
