module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$botCount`,
      d.message.guild.members.cache.filter((m) => m.user.bot).size
    ),
  };
};
