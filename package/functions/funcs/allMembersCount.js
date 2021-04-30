module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$allMembersCount`,
      d.client.guilds.cache
        .map((g) => g.memberCount || 0)
        .reduce((x, y) => x + y, 0)
    ),
  };
};
