module.exports = (d) => {
  let code = d.command.code;

  const mentions = code.match(
    /(<|#LEFT_CLICK#)@!?(\d{17,19})(>|#RIGHT_CLICK#)/g
  );

  if (mentions)
    for (const mention of mentions) {
      const user = d.message.mentions.users.get(mention.match(/\d+/g).join(""));

      if (user) code = code.split(mention).join(user.username);
    }

  return {
    code: code.replaceLast(`$disableMentions`, ""),
  };
};
