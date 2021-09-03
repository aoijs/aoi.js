module.exports = async (d) => {
    return {
      code: d.command.code.replaceLast(
        `$isEveryoneMentioned`,
        d.message.mentions.everyone
      ),
    };
  };
