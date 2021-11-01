module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(
        `$allRoleCount`,
        d.client.guilds.cache
          .map((g) => g.roles.cache.size || 0)
          .reduce((x, y) => x + y, 0)
      ),
    };
  };
  