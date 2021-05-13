module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$authorAvatarCode`,
      d.message.author.avatar
      })
    ),
  };
}; //@falsisdev uWu
