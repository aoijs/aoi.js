module.exports = async (d) => {
  const message = d.message;

  return {
    code: d.command.code.replaceLast(
      `$mentionedRolesCount`,
      message ? message.mentions.roles.size : 0
    ),
  };
};
