const ms = require("ms");

const botTyping = (d) => {
  let code = d.command.code;
  const inside = d.unpack() 
  const [time] = inside.splits;
  d.message.channel.sendTyping();

  /*let timeout = splits[0] ? ms(anything.splits[0]) || 5000 : 5000;

  /*setTimeout(() => {
    d.message.channel.stopTyping(true);
  }, timeout);
*/
  code = code.replaceLast(`$botTyping${inside.total}`, "");
  return {
    code: code,
  };
};

module.exports = botTyping;
