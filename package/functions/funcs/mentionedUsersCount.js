module.exports = async (d) => {
  const message = d.message;

  return {
    code: d.command.code.replaceLast(
      `$mentionedUsersCount`,
      message ? message.mentions.users.size : 0
    ),
  };
};
