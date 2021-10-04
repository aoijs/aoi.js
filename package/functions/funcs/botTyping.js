const ms = require("ms");

const botTyping = (d) => {
  let code = d.command.code;

  const r = code.split("$botTyping").length - 1;
  const anything = code.split("$botTyping")[r].after();

  d.message.channel.startTyping();

  let timeout = anything.splits[0] ? ms(anything.splits[0]) || 5000 : 5000;

  setTimeout(() => {
    d.message.channel.stopTyping(true);
  }, timeout);

  code = code.replaceLast(`$botTyping${anything.total}`, "");
  return {
    code: code,
  };
};

module.exports = botTyping;
