module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$authorAvatar`,
      d.message.author.displayAvatarURL({
        dynamic: true,
        size: 4096,
      })
    ),
  };
};
