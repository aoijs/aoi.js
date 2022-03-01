module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [guildId = "global", id, ...perms] = data.inside.splits;

  let permissions = [];
  if (perms.length === 1) {
    try {
      permissions = JSON.parse(perms);
    } catch {
      const e = perms[0].split(":");
      permissions.push({
        id: e[0],
        type: e[1].toUpperCase(),
        permission: e[2] === "yes",
      });
    }
  } else {
    const e = perms[0].split(":");
    permissions.push({
      id: e[0],
      type: e[1].toUpperCase(),
      permission: e[2] === "yes",
    });
  }

  if (guildId == "global") {
    d.client.application.commands.permissions.set({
      command: id,
      permissions,
    });
  } else {
    d.client.application.commands.permissions.set({
      guild: guildId,
      command: id,
      permissions,
    });
  }

  return {
    code: d.util.setCode(data),
  };
};
