module.exports = (d) => {
  let code = d.command.code;

  const mentions = code.match(
    /(<|#LEFT_CLICK#)#?(\d{17,19})(>|#RIGHT_CLICK#)/g
  );

  if (mentions)
    for (const mention of mentions) {
      const channel = d.message.mentions.channels.get(
        mention.match(/\d+/g).join("")
      );

      if (channel) code = code.split(mention).join(channel.name);
    }

  return {
    code: code.replaceLast(`$disableChannelMentions`, ""),
  };
};
